import { FastifyRequest, FastifyReply } from 'fastify';
import {
    CreateAgentRequestSchemaType,
    UpdateAgentRequestSchemaType,
    ListAgentsQuerySchemaType,
    AgentIdParamSchemaType
} from './schema';
import {
    createAgent,
    getAgent,
    updateAgent,
    deleteAgent,
    listAgents
} from './utils';

/**
 * List all agents for the team associated with the API key
 */
export async function handleListAgents(
    request: FastifyRequest<{
        Querystring: ListAgentsQuerySchemaType
    }>,
    reply: FastifyReply
) {
    try {
        const agents = await listAgents(request, request.query);
        return reply.send({ ok: true, data: agents });
    } catch (error) {
        throw error;
    }
}

/**
 * Create a new agent for the team associated with the API key
 */
export async function handleCreateAgent(
    request: FastifyRequest<{
        Body: CreateAgentRequestSchemaType
    }>,
    reply: FastifyReply
) {
    try {
        const agent = await createAgent(request, request.body);
        return reply.status(201).send({ ok: true, data: agent });
    } catch (error) {
        throw error;
    }
}

/**
 * Get agent by ID (scoped to team)
 */
export async function handleGetAgent(
    request: FastifyRequest<{
        Params: AgentIdParamSchemaType
    }>,
    reply: FastifyReply
) {
    try {
        const { id } = request.params;
        const agent = await getAgent(request, id);
        if (!agent) {
            return reply.status(404).send({ ok: false, error: 'Agent not found' });
        }
        return reply.send({ ok: true, data: agent });
    } catch (error) {
        throw error;
    }
}

/**
 * Update agent (scoped to team)
 */
export async function handleUpdateAgent(
    request: FastifyRequest<{
        Params: AgentIdParamSchemaType,
        Body: UpdateAgentRequestSchemaType
    }>,
    reply: FastifyReply
) {
    try {
        const { id } = request.params;
        const agent = await updateAgent(request, id, request.body);
        if (!agent) {
            return reply.status(404).send({ ok: false, error: 'Agent not found' });
        }
        return reply.send({ ok: true, data: agent });
    } catch (error) {
        throw error;
    }
}

/**
 * Delete agent (soft delete, scoped to team)
 */
export async function handleDeleteAgent(
    request: FastifyRequest<{
        Params: AgentIdParamSchemaType
    }>,
    reply: FastifyReply
) {
    try {
        const { id } = request.params;
        const success = await deleteAgent(request, id);
        if (!success) {
            return reply.status(404).send({ ok: false, error: 'Agent not found' });
        }
        return reply.send({ ok: true, data: { message: 'Agent deleted successfully' } });
    } catch (error) {
        throw error;
    }
} 