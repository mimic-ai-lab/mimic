import { FastifyRequest } from 'fastify';
import { CreateAgentRequestSchemaType, UpdateAgentRequestSchemaType, ListAgentsQuerySchemaType } from './schema';

/**
 * Decode cursor token for pagination
 */
function decodeCursor(token: string): { id: string; created_at: string } | null {
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

/**
 * Encode cursor token for pagination
 */
function encodeCursor(id: string, created_at: string): string {
    const cursor = { id, created_at };
    return Buffer.from(JSON.stringify(cursor)).toString('base64');
}

/**
 * List agents for the team associated with the API key
 */
export async function listAgents(request: FastifyRequest, query: ListAgentsQuerySchemaType) {
    const teamId = request.team?.teamId;

    if (!teamId) {
        throw new Error('Team context not available');
    }

    // Validate and parse limit
    let limit = 10;
    if (query.limit) {
        const parsedLimit = parseInt(query.limit.toString());
        if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
            throw new Error('Limit must be a number between 1 and 100');
        }
        limit = parsedLimit;
    }

    const cursor = query.nextToken ? decodeCursor(query.nextToken) : null;

    // Validate cursor if provided
    if (query.nextToken && !cursor) {
        throw new Error('Invalid pagination token');
    }

    try {
        let queryBuilder = request.pg
            .selectFrom('agents')
            .selectAll()
            .where('deleted_at', 'is', null)
            .where('team_id', '=', teamId); // Scope to team from API key

        // Apply filters
        if (query.status) {
            if (!['draft', 'active', 'paused', 'archived'].includes(query.status)) {
                throw new Error('Invalid status filter');
            }
            queryBuilder = queryBuilder.where('status', '=', query.status);
        }
        if (query.agent_type) {
            if (!['chat', 'voice'].includes(query.agent_type)) {
                throw new Error('Invalid agent_type filter');
            }
            queryBuilder = queryBuilder.where('agent_type', '=', query.agent_type);
        }
        if (query.platform) {
            queryBuilder = queryBuilder.where('platform', '=', query.platform);
        }

        // Apply cursor pagination
        if (cursor) {
            const cursorDate = new Date(cursor.created_at);
            if (isNaN(cursorDate.getTime())) {
                throw new Error('Invalid pagination token format');
            }
            queryBuilder = queryBuilder.where((eb) =>
                eb.or([
                    eb('created_at', '<', cursorDate),
                    eb.and([
                        eb('created_at', '=', cursorDate),
                        eb('id', '<', cursor.id)
                    ])
                ])
            );
        }

        // Get one extra record to determine if there are more results
        const results = await queryBuilder
            .orderBy('created_at', 'desc')
            .orderBy('id', 'desc')
            .limit(limit + 1)
            .execute();

        const hasMore = results.length > limit;
        const agents = hasMore ? results.slice(0, limit) : results;

        // Generate next token
        let nextToken: string | null = null;
        if (hasMore && agents.length > 0) {
            const lastAgent = agents[agents.length - 1];
            nextToken = encodeCursor(lastAgent.id, lastAgent.created_at.toISOString());
        }

        return {
            agents,
            nextToken,
            hasMore
        };
    } catch (error) {
        if (error instanceof Error && error.message.includes('Invalid')) {
            throw error; // Re-throw validation errors
        }
        throw new Error(`Failed to list agents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Create a new agent for the team associated with the API key
 */
export async function createAgent(request: FastifyRequest, data: CreateAgentRequestSchemaType) {
    const now = new Date();
    const teamId = request.team?.teamId;

    if (!teamId) {
        throw new Error('Team context not available');
    }

    // Use the CLI system user ID for CLI-created resources
    // This is a dedicated user for CLI operations that doesn't require Clerk authentication
    const CLI_SYSTEM_USER_ID = '550e8400-e29b-41d4-a716-446655440003';

    // Validate required fields
    if (!data.name || !data.description || !data.agent_type || !data.platform) {
        throw new Error('Missing required fields: name, description, agent_type, platform');
    }

    // Validate agent_type
    if (!['chat', 'voice'].includes(data.agent_type)) {
        throw new Error('Invalid agent_type. Must be "chat" or "voice"');
    }

    // Validate status
    if (data.status && !['draft', 'active', 'paused', 'archived'].includes(data.status)) {
        throw new Error('Invalid status. Must be "draft", "active", "paused", or "archived"');
    }

    try {
        const [agent] = await request.pg
            .insertInto('agents')
            .values({
                team_id: teamId, // Use team from API key context
                created_by: CLI_SYSTEM_USER_ID, // Use CLI system user for CLI operations
                name: data.name,
                description: data.description,
                agent_type: data.agent_type,
                platform: data.platform,
                platform_config: data.platform_config || {},
                status: data.status || 'draft',
                is_active: data.is_active !== undefined ? data.is_active : true,
                created_at: now,
                updated_at: now,
                deleted_at: null,
            } as any)
            .returningAll()
            .execute();

        // Trigger Temporal workflow for agent bootstrap
        // This will generate personas and evaluations for the new agent
        try {
            // Trigger Temporal workflow for agent bootstrap
            const { triggerAgentBootstrap } = await import('@/lib/temporal-client');
            const workflowId = await triggerAgentBootstrap({
                agentId: agent.id,
                teamId: teamId,
                agentName: data.name,
                agentDescription: data.description,
                platform: data.platform,
            });
            console.log(`✅ Agent bootstrap workflow triggered successfully. Workflow ID: ${workflowId}`);
        } catch (workflowError) {
            console.error('❌ Failed to trigger agent bootstrap workflow:', workflowError);
            // Don't fail the agent creation if workflow trigger fails
        }

        return agent;
    } catch (error) {
        // Handle database constraint violations
        if (error instanceof Error) {
            if (error.message.includes('foreign key constraint')) {
                throw new Error('Invalid team_id or created_by reference');
            }
            if (error.message.includes('unique constraint')) {
                throw new Error('Agent with this name already exists in the team');
            }
        }
        throw new Error(`Failed to create agent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Get agent by ID (scoped to team)
 */
export async function getAgent(request: FastifyRequest, id: string) {
    const teamId = request.team?.teamId;

    if (!teamId) {
        throw new Error('Team context not available');
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
        throw new Error('Invalid agent ID format');
    }

    try {
        const [agent] = await request.pg
            .selectFrom('agents')
            .selectAll()
            .where('id', '=', id)
            .where('team_id', '=', teamId) // Scope to team from API key
            .where('deleted_at', 'is', null)
            .execute();

        return agent || null;
    } catch (error) {
        throw new Error(`Failed to retrieve agent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Update agent (scoped to team)
 */
export async function updateAgent(request: FastifyRequest, id: string, data: UpdateAgentRequestSchemaType) {
    const now = new Date();
    const teamId = request.team?.teamId;

    if (!teamId) {
        throw new Error('Team context not available');
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
        throw new Error('Invalid agent ID format');
    }

    // Validate provided fields
    if (data.agent_type && !['chat', 'voice'].includes(data.agent_type)) {
        throw new Error('Invalid agent_type. Must be "chat" or "voice"');
    }

    if (data.status && !['draft', 'active', 'paused', 'archived'].includes(data.status)) {
        throw new Error('Invalid status. Must be "draft", "active", "paused", or "archived"');
    }

    const updateData: any = {
        updated_at: now,
    };

    // Only include fields that are provided
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.agent_type !== undefined) updateData.agent_type = data.agent_type;
    if (data.platform !== undefined) updateData.platform = data.platform;
    if (data.platform_config !== undefined) updateData.platform_config = data.platform_config;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;

    try {
        const [agent] = await request.pg
            .updateTable('agents')
            .set(updateData)
            .where('id', '=', id)
            .where('team_id', '=', teamId) // Scope to team from API key
            .where('deleted_at', 'is', null)
            .returningAll()
            .execute();

        return agent || null;
    } catch (error) {
        // Handle database constraint violations
        if (error instanceof Error) {
            if (error.message.includes('foreign key constraint')) {
                throw new Error('Invalid team_id reference');
            }
            if (error.message.includes('unique constraint')) {
                throw new Error('Agent with this name already exists in the team');
            }
        }
        throw new Error(`Failed to update agent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Delete agent (soft delete, scoped to team)
 */
export async function deleteAgent(request: FastifyRequest, id: string) {
    const now = new Date();
    const teamId = request.team?.teamId;

    if (!teamId) {
        throw new Error('Team context not available');
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
        throw new Error('Invalid agent ID format');
    }

    try {
        const [agent] = await request.pg
            .updateTable('agents')
            .set({
                status: 'archived',
                is_active: false,
                deleted_at: now,
                updated_at: now,
            })
            .where('id', '=', id)
            .where('team_id', '=', teamId) // Scope to team from API key
            .where('deleted_at', 'is', null)
            .returningAll()
            .execute();

        return agent !== undefined;
    } catch (error) {
        throw new Error(`Failed to delete agent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
} 