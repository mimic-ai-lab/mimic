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
 * List agents with cursor-based pagination and filtering
 */
export async function listAgents(request: FastifyRequest, query: ListAgentsQuerySchemaType) {
    const limit = parseInt(query.limit);
    const cursor = query.nextToken ? decodeCursor(query.nextToken) : null;

    let queryBuilder = request.pg
        .selectFrom('agents')
        .selectAll()
        .where('deleted_at', 'is', null);

    // Apply filters
    if (query.status) {
        queryBuilder = queryBuilder.where('status', '=', query.status);
    }
    if (query.agent_type) {
        queryBuilder = queryBuilder.where('agent_type', '=', query.agent_type);
    }
    if (query.platform) {
        queryBuilder = queryBuilder.where('platform', '=', query.platform);
    }
    if (query.team_id) {
        queryBuilder = queryBuilder.where('team_id', '=', query.team_id);
    }

    // Apply cursor pagination
    if (cursor) {
        const cursorDate = new Date(cursor.created_at);
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
}

/**
 * Create a new agent
 */
export async function createAgent(request: FastifyRequest, data: CreateAgentRequestSchemaType) {
    const now = new Date();

    const [agent] = await request.pg
        .insertInto('agents')
        .values({
            team_id: data.team_id,
            name: data.name,
            description: data.description,
            agent_type: data.agent_type,
            platform: data.platform,
            platform_config: data.platform_config,
            status: data.status,
            is_active: data.is_active,
            created_at: now,
            updated_at: now,
            deleted_at: null,
        } as any)
        .returningAll()
        .execute();

    return agent;
}

/**
 * Get agent by ID
 */
export async function getAgent(request: FastifyRequest, id: string) {
    const [agent] = await request.pg
        .selectFrom('agents')
        .selectAll()
        .where('id', '=', id)
        .where('deleted_at', 'is', null)
        .execute();

    return agent || null;
}

/**
 * Update agent
 */
export async function updateAgent(request: FastifyRequest, id: string, data: UpdateAgentRequestSchemaType) {
    const now = new Date();

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

    const [agent] = await request.pg
        .updateTable('agents')
        .set(updateData)
        .where('id', '=', id)
        .where('deleted_at', 'is', null)
        .returningAll()
        .execute();

    return agent || null;
}

/**
 * Delete agent (soft delete)
 */
export async function deleteAgent(request: FastifyRequest, id: string) {
    const now = new Date();

    const [agent] = await request.pg
        .updateTable('agents')
        .set({
            status: 'archived',
            is_active: false,
            deleted_at: now,
            updated_at: now,
        })
        .where('id', '=', id)
        .where('deleted_at', 'is', null)
        .returningAll()
        .execute();

    return agent !== undefined;
}

/**
 * Activate agent
 */
export async function activateAgent(request: FastifyRequest, id: string) {
    const now = new Date();

    const [agent] = await request.pg
        .updateTable('agents')
        .set({
            status: 'active',
            is_active: true,
            updated_at: now,
        })
        .where('id', '=', id)
        .where('deleted_at', 'is', null)
        .returningAll()
        .execute();

    return agent || null;
}

/**
 * Pause agent
 */
export async function pauseAgent(request: FastifyRequest, id: string) {
    const now = new Date();

    const [agent] = await request.pg
        .updateTable('agents')
        .set({
            status: 'paused',
            is_active: false,
            updated_at: now,
        })
        .where('id', '=', id)
        .where('deleted_at', 'is', null)
        .returningAll()
        .execute();

    return agent || null;
}

/**
 * Archive agent
 */
export async function archiveAgent(request: FastifyRequest, id: string) {
    const now = new Date();

    const [agent] = await request.pg
        .updateTable('agents')
        .set({
            status: 'archived',
            is_active: false,
            updated_at: now,
        })
        .where('id', '=', id)
        .where('deleted_at', 'is', null)
        .returningAll()
        .execute();

    return agent || null;
} 