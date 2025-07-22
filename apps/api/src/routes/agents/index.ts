import { FastifyInstance } from 'fastify';
import {
    handleListAgents,
    handleCreateAgent,
    handleGetAgent,
    handleUpdateAgent,
    handleDeleteAgent,
    handleActivateAgent,
    handlePauseAgent,
    handleArchiveAgent
} from './handlers';
import {
    CreateAgentRequestJsonSchema,
    UpdateAgentRequestJsonSchema,
    ListAgentsQueryJsonSchema,
    AgentIdParamJsonSchema
} from './schema';

/**
 * Agent Management Routes
 * 
 * Provides RESTful API endpoints for managing AI agents in the Mimic platform.
 * Agents can be chat-based or voice-based and are associated with teams.
 * 
 * @example
 * ```bash
 * # List all agents for a team with cursor-based pagination
 * GET /agents?team_id=550e8400-e29b-41d4-a716-446655440000&status=active&limit=10
 * 
 * # Get next page using nextToken
 * GET /agents?nextToken=eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsImNyZWF0ZWRfYXQiOiIyMDI0LTAxLTE1VDEwOjMwOjAwWiJ9&limit=10
 * 
 * # Create a new WhatsApp agent
 * POST /agents
 * {
 *   "team_id": "550e8400-e29b-41d4-a716-446655440000",
 *   "name": "Customer Support Bot",
 *   "description": "AI assistant for handling customer inquiries",
 *   "agent_type": "chat",
 *   "platform": "whatsapp",
 *   "platform_config": { "webhook_url": "https://example.com/webhook" }
 * }
 * 
 * # Get agent details
 * GET /agents/550e8400-e29b-41d4-a716-446655440000
 * 
 * # Update agent status
 * PUT /agents/550e8400-e29b-41d4-a716-446655440000
 * {
 *   "status": "active",
 *   "description": "Updated description"
 * }
 * 
 * # Activate an agent
 * PATCH /agents/550e8400-e29b-41d4-a716-446655440000/activate
 * 
 * # Pause an agent
 * PATCH /agents/550e8400-e29b-41d4-a716-446655440000/pause
 * 
 * # Archive an agent
 * PATCH /agents/550e8400-e29b-41d4-a716-446655440000/archive
 * 
 * # Delete an agent (soft delete)
 * DELETE /agents/550e8400-e29b-41d4-a716-446655440000
 * ```
 */
export default async function AgentRoutes(fastify: FastifyInstance): Promise<void> {
    /**
     * List Agents
     * 
     * Retrieves a paginated list of agents using cursor-based pagination with optional filtering by status,
     * agent type, platform, and team ID.
     * 
     * @route GET /agents
     * @param {string} limit - Items per page (default: 10, max: 100)
     * @param {string} [nextToken] - Cursor for pagination (base64 encoded)
     * @param {string} status - Filter by status: draft, active, paused, archived
     * @param {string} agent_type - Filter by type: chat, voice
     * @param {string} platform - Filter by platform (e.g., whatsapp, telegram)
     * @param {string} team_id - Filter by team ID (UUID)
     * 
     * @returns {object} List of agents with cursor-based pagination
     * @example
     * ```json
     * {
     *   "ok": true,
     *   "data": {
     *     "agents": [
     *       {
     *         "id": "550e8400-e29b-41d4-a716-446655440000",
     *         "name": "Customer Support Bot",
     *         "description": "AI assistant for handling customer inquiries",
     *         "agent_type": "chat",
     *         "platform": "whatsapp",
     *         "status": "active",
     *         "is_active": true,
     *         "created_at": "2024-01-15T10:30:00Z",
     *         "updated_at": "2024-01-15T10:30:00Z"
     *       }
     *     ],
     *     "nextToken": "eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsImNyZWF0ZWRfYXQiOiIyMDI0LTAxLTE1VDEwOjMwOjAwWiJ9",
     *     "hasMore": true
     *   }
     * }
     * ```
     */
    fastify.get('/agents', {
        schema: {
            querystring: ListAgentsQueryJsonSchema
        },
        handler: handleListAgents
    });

    /**
     * Create Agent
     * 
     * Creates a new AI agent with the specified configuration.
     * 
     * @route POST /agents
     * @param {object} body - Agent creation data
     * @param {string} body.team_id - Team ID (UUID)
     * @param {string} body.name - Agent name (1-255 characters)
     * @param {string} body.description - Agent description (1-1000 characters)
     * @param {string} body.agent_type - Agent type: chat, voice
     * @param {string} body.platform - Platform name (1-100 characters)
     * @param {object} [body.platform_config] - Platform-specific configuration
     * @param {string} [body.status] - Initial status (default: draft)
     * @param {boolean} [body.is_active] - Active status (default: true)
     * 
     * @returns {object} Created agent data
     * @example
     * ```json
     * {
     *   "ok": true,
     *   "data": {
     *     "id": "550e8400-e29b-41d4-a716-446655440000",
     *     "team_id": "550e8400-e29b-41d4-a716-446655440000",
     *     "name": "Customer Support Bot",
     *     "description": "AI assistant for handling customer inquiries",
     *     "agent_type": "chat",
     *     "platform": "whatsapp",
     *     "platform_config": { "webhook_url": "https://example.com/webhook" },
     *     "status": "draft",
     *     "is_active": true,
     *     "created_at": "2024-01-15T10:30:00Z",
     *     "updated_at": "2024-01-15T10:30:00Z"
     *   }
     * }
     * ```
     */
    fastify.post('/agents', {
        schema: {
            body: CreateAgentRequestJsonSchema
        },
        handler: handleCreateAgent
    });

    /**
     * Get Agent
     * 
     * Retrieves detailed information about a specific agent by ID.
     * 
     * @route GET /agents/:id
     * @param {string} id - Agent ID (UUID)
     * 
     * @returns {object} Agent details
     * @throws {404} Agent not found
     * @example
     * ```json
     * {
     *   "ok": true,
     *   "data": {
     *     "id": "550e8400-e29b-41d4-a716-446655440000",
     *     "team_id": "550e8400-e29b-41d4-a716-446655440000",
     *     "name": "Customer Support Bot",
     *     "description": "AI assistant for handling customer inquiries",
     *     "agent_type": "chat",
     *     "platform": "whatsapp",
     *     "platform_config": { "webhook_url": "https://example.com/webhook" },
     *     "status": "active",
     *     "is_active": true,
     *     "created_at": "2024-01-15T10:30:00Z",
     *     "updated_at": "2024-01-15T10:30:00Z"
     *   }
     * }
     * ```
     */
    fastify.get('/agents/:id', {
        schema: {
            params: AgentIdParamJsonSchema
        },
        handler: handleGetAgent
    });

    /**
     * Update Agent
     * 
     * Updates an existing agent's configuration. Only provided fields will be updated.
     * 
     * @route PUT /agents/:id
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
     * @example
     * ```json
     * {
     *   "ok": true,
     *   "data": {
     *     "id": "550e8400-e29b-41d4-a716-446655440000",
     *     "name": "Updated Support Bot",
     *     "description": "Enhanced AI assistant for customer inquiries",
     *     "status": "active",
     *     "updated_at": "2024-01-15T11:30:00Z"
     *   }
     * }
     * ```
     */
    fastify.put('/agents/:id', {
        schema: {
            params: AgentIdParamJsonSchema,
            body: UpdateAgentRequestJsonSchema
        },
        handler: handleUpdateAgent
    });

    /**
     * Delete Agent
     * 
     * Soft deletes an agent by setting its status to archived and is_active to false.
     * The agent data is preserved for audit purposes.
     * 
     * @route DELETE /agents/:id
     * @param {string} id - Agent ID (UUID)
     * 
     * @returns {object} Success message
     * @throws {404} Agent not found
     * @example
     * ```json
     * {
     *   "ok": true,
     *   "data": {
     *     "message": "Agent deleted successfully"
     *   }
     * }
     * ```
     */
    fastify.delete('/agents/:id', {
        schema: {
            params: AgentIdParamJsonSchema
        },
        handler: handleDeleteAgent
    });

    /**
     * Activate Agent
     * 
     * Changes an agent's status to 'active' and sets is_active to true.
     * This makes the agent available for use in conversations.
     * 
     * @route PATCH /agents/:id/activate
     * @param {string} id - Agent ID (UUID)
     * 
     * @returns {object} Updated agent data
     * @throws {404} Agent not found
     * @example
     * ```json
     * {
     *   "ok": true,
     *   "data": {
     *     "id": "550e8400-e29b-41d4-a716-446655440000",
     *     "status": "active",
     *     "is_active": true,
     *     "updated_at": "2024-01-15T12:30:00Z"
     *   }
     * }
     * ```
     */
    fastify.patch('/agents/:id/activate', {
        schema: {
            params: AgentIdParamJsonSchema
        },
        handler: handleActivateAgent
    });

    /**
     * Pause Agent
     * 
     * Changes an agent's status to 'paused' and sets is_active to false.
     * This temporarily disables the agent from participating in conversations.
     * 
     * @route PATCH /agents/:id/pause
     * @param {string} id - Agent ID (UUID)
     * 
     * @returns {object} Updated agent data
     * @throws {404} Agent not found
     * @example
     * ```json
     * {
     *   "ok": true,
     *   "data": {
     *     "id": "550e8400-e29b-41d4-a716-446655440000",
     *     "status": "paused",
     *     "is_active": false,
     *     "updated_at": "2024-01-15T12:30:00Z"
     *   }
     * }
     * ```
     */
    fastify.patch('/agents/:id/pause', {
        schema: {
            params: AgentIdParamJsonSchema
        },
        handler: handlePauseAgent
    });

    /**
     * Archive Agent
     * 
     * Changes an agent's status to 'archived' and sets is_active to false.
     * This permanently disables the agent and marks it for long-term storage.
     * 
     * @route PATCH /agents/:id/archive
     * @param {string} id - Agent ID (UUID)
     * 
     * @returns {object} Updated agent data
     * @throws {404} Agent not found
     * @example
     * ```json
     * {
     *   "ok": true,
     *   "data": {
     *     "id": "550e8400-e29b-41d4-a716-446655440000",
     *     "status": "archived",
     *     "is_active": false,
     *     "updated_at": "2024-01-15T12:30:00Z"
     *   }
     * }
     * ```
     */
    fastify.patch('/agents/:id/archive', {
        schema: {
            params: AgentIdParamJsonSchema
        },
        handler: handleArchiveAgent
    });
} 