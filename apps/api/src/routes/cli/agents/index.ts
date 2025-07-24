import { FastifyInstance } from 'fastify';
import {
    handleListAgents,
    handleCreateAgent,
    handleGetAgent,
    handleUpdateAgent,
    handleDeleteAgent
} from './handlers';
import { requireApiKeyAuth } from '@/plugins/auth';
import {
    CreateAgentRequestJsonSchema,
    UpdateAgentRequestJsonSchema,
    ListAgentsQueryJsonSchema,
    AgentIdParamJsonSchema
} from './schema';

/**
 * CLI Agent Management Routes
 * 
 * Provides RESTful API endpoints for managing AI agents via CLI using API key authentication.
 * These routes are scoped to the team associated with the API key.
 * 
 * @example
 * ```bash
 * # List all agents for the team (scoped by API key)
 * GET /api/cli/agents
 * 
 * # Create a new agent (team_id derived from API key)
 * POST /api/cli/agents
 * {
 *   "name": "Customer Support Bot",
 *   "description": "AI assistant for handling customer inquiries",
 *   "agent_type": "chat",
 *   "platform": "whatsapp",
 *   "platform_config": { "webhook_url": "https://example.com/webhook" }
 * }
 * 
 * # Get agent details
 * GET /api/cli/agents/550e8400-e29b-41d4-a716-446655440000
 * 
 * # Update agent
 * PUT /api/cli/agents/550e8400-e29b-41d4-a716-446655440000
 * {
 *   "status": "active",
 *   "description": "Updated description"
 * }
 * 
 * # Delete agent
 * DELETE /api/cli/agents/550e8400-e29b-41d4-a716-446655440000
 * ```
 */
export default async function CLIAgentRoutes(fastify: FastifyInstance): Promise<void> {
    /**
     * List Agents (CLI)
     * 
     * Retrieves a paginated list of agents for the team associated with the API key.
     * No team_id filter needed as it's automatically scoped to the API key's team.
     * 
     * @route GET /api/cli/agents
     * @param {string} limit - Items per page (default: 10, max: 100)
     * @param {string} [nextToken] - Cursor for pagination (base64 encoded)
     * @param {string} status - Filter by status: draft, active, paused, archived
     * @param {string} agent_type - Filter by type: chat, voice
     * @param {string} platform - Filter by platform (e.g., whatsapp, telegram)
     * 
     * @returns {object} List of agents with cursor-based pagination
     */
    fastify.get('/', {
        schema: {
            querystring: ListAgentsQueryJsonSchema
        },
        preHandler: requireApiKeyAuth,
        handler: handleListAgents
    });

    /**
     * Create Agent (CLI)
     * 
     * Creates a new AI agent for the team associated with the API key.
     * The team_id is automatically derived from the API key context.
     * 
     * @route POST /api/cli/agents
     * @param {object} body - Agent creation data (no team_id needed)
     * @param {string} body.name - Agent name (1-255 characters)
     * @param {string} body.description - Agent description (1-1000 characters)
     * @param {string} body.agent_type - Agent type: chat, voice
     * @param {string} body.platform - Platform name (1-100 characters)
     * @param {object} [body.platform_config] - Platform-specific configuration
     * @param {string} [body.status] - Initial status (default: draft)
     * @param {boolean} [body.is_active] - Active status (default: true)
     * 
     * @returns {object} Created agent data
     */
    fastify.post('/', {
        schema: {
            body: CreateAgentRequestJsonSchema
        },
        preHandler: requireApiKeyAuth,
        handler: handleCreateAgent
    });

    /**
     * Get Agent (CLI)
     * 
     * Retrieves detailed information about a specific agent by ID.
     * Access is scoped to the team associated with the API key.
     * 
     * @route GET /api/cli/agents/:id
     * @param {string} id - Agent ID (UUID)
     * 
     * @returns {object} Agent details
     * @throws {404} Agent not found
     */
    fastify.get('/:id', {
        schema: {
            params: AgentIdParamJsonSchema
        },
        preHandler: requireApiKeyAuth,
        handler: handleGetAgent
    });

    /**
     * Update Agent (CLI)
     * 
     * Updates an existing agent's configuration. Only provided fields will be updated.
     * Access is scoped to the team associated with the API key.
     * 
     * @route PUT /api/cli/agents/:id
     * @param {string} id - Agent ID (UUID)
     * @param {object} body - Agent update data (all fields optional)
     * @param {string} [body.name] - Agent name (1-255 characters)
     * @param {string} [body.description] - Agent description (1-1000 characters)
     * @param {string} [body.agent_type] - Agent type: chat, voice
     * @param {string} [body.platform] - Platform name (1-100 characters)
     * @param {object} [body.platform_config] - Platform-specific configuration
     * @param {string} [body.status] - Status: draft, active, paused, archived
     * @param {boolean} [body.is_active] - Active status
     * 
     * @returns {object} Updated agent data
     * @throws {404} Agent not found
     */
    fastify.put('/:id', {
        schema: {
            params: AgentIdParamJsonSchema,
            body: UpdateAgentRequestJsonSchema
        },
        preHandler: requireApiKeyAuth,
        handler: handleUpdateAgent
    });

    /**
     * Delete Agent (CLI)
     * 
     * Soft deletes an agent by setting its status to archived and is_active to false.
     * Access is scoped to the team associated with the API key.
     * 
     * @route DELETE /api/cli/agents/:id
     * @param {string} id - Agent ID (UUID)
     * 
     * @returns {object} Success message
     * @throws {404} Agent not found
     */
    fastify.delete('/:id', {
        schema: {
            params: AgentIdParamJsonSchema
        },
        preHandler: requireApiKeyAuth,
        handler: handleDeleteAgent
    });
} 