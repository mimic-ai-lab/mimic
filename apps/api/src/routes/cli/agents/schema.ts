import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

/**
 * Schema for creating a new agent via CLI (no team_id required)
 * 
 * @example
 * ```json
 * {
 *   "name": "Customer Support Bot",
 *   "description": "AI assistant for handling customer inquiries",
 *   "agent_type": "chat",
 *   "platform": "whatsapp",
 *   "platform_config": { "webhook_url": "https://example.com/webhook" },
 *   "status": "draft",
 *   "is_active": true
 * }
 * ```
 */
export const CreateAgentRequestSchema = z.object({
    name: z.string().min(1, "Agent name cannot be empty").max(255, "Agent name too long"),
    description: z.string().min(1, "Description cannot be empty").max(1000, "Description too long"),
    agent_type: z.enum(["chat", "voice"]),
    platform: z.string().min(1, "Platform cannot be empty").max(100, "Platform name too long"),
    platform_config: z.record(z.string(), z.any()).default({}),
    status: z.enum(["draft", "active", "paused", "archived"]).default("draft"),
    is_active: z.boolean().default(true)
    // Note: team_id is derived from API key context
});

export const CreateAgentRequestJsonSchema = zodToJsonSchema(CreateAgentRequestSchema, "createAgentRequestSchema");
export type CreateAgentRequestSchemaType = z.infer<typeof CreateAgentRequestSchema>;

/**
 * Schema for updating an agent via CLI
 * 
 * @example
 * ```json
 * {
 *   "name": "Updated Support Bot",
 *   "description": "Enhanced AI assistant for customer inquiries",
 *   "status": "active",
 *   "is_active": true
 * }
 * ```
 */
export const UpdateAgentRequestSchema = z.object({
    name: z.string().min(1, "Agent name cannot be empty").max(255, "Agent name too long").optional(),
    description: z.string().min(1, "Description cannot be empty").max(1000, "Description too long").optional(),
    agent_type: z.enum(["chat", "voice"]).optional(),
    platform: z.string().min(1, "Platform cannot be empty").max(100, "Platform name too long").optional(),
    platform_config: z.record(z.string(), z.any()).optional(),
    status: z.enum(["draft", "active", "paused", "archived"]).optional(),
    is_active: z.boolean().optional()
});

export const UpdateAgentRequestJsonSchema = zodToJsonSchema(UpdateAgentRequestSchema, "updateAgentRequestSchema");
export type UpdateAgentRequestSchemaType = z.infer<typeof UpdateAgentRequestSchema>;

/**
 * Schema for agent query parameters with cursor-based pagination (CLI)
 * Note: No team_id filter needed as it's scoped by API key
 * 
 * @example
 * ```json
 * {
 *   "limit": "10",
 *   "nextToken": "eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsImNyZWF0ZWRfYXQiOiIyMDI0LTAxLTE1VDEwOjMwOjAwWiJ9",
 *   "status": "active",
 *   "agent_type": "chat",
 *   "platform": "whatsapp"
 * }
 * ```
 */
export const ListAgentsQuerySchema = z.object({
    limit: z.string().optional(),
    nextToken: z.string().optional(),
    status: z.enum(["draft", "active", "paused", "archived"]).optional(),
    agent_type: z.enum(["chat", "voice"]).optional(),
    platform: z.string().optional()
    // Note: team_id is derived from API key context
});

export const ListAgentsQueryJsonSchema = zodToJsonSchema(ListAgentsQuerySchema, "listAgentsQuerySchema");
export type ListAgentsQuerySchemaType = z.infer<typeof ListAgentsQuerySchema>;

/**
 * Schema for agent ID parameter
 */
export const AgentIdParamSchema = z.object({
    id: z.string().uuid("Agent ID must be a valid UUID")
});

export const AgentIdParamJsonSchema = zodToJsonSchema(AgentIdParamSchema, "agentIdParamSchema");
export type AgentIdParamSchemaType = z.infer<typeof AgentIdParamSchema>; 