/**
 * Registers all API routes for the Mimic server.
 *
 * @param {FastifyInstance} fastify - The Fastify server instance
 * @returns {Promise<void>}
 */
import { FastifyInstance } from 'fastify';

import HealthRoutes from '@/routes/health';
import AgentRoutes from '@/routes/agents';
import CLIRoutes from '@/routes/cli';
import ClerkWebhookRoutes from '@/routes/webhooks/clerk';

export default async function setupRoutes(fastify: FastifyInstance): Promise<void> {
    // Register health check routes (GET /health)
    fastify.register(HealthRoutes);

    // Register dashboard agent routes (JWT auth)
    fastify.register(AgentRoutes);

    // Register CLI routes (API key auth)
    fastify.register(CLIRoutes, { prefix: '/api/cli' });

    // Register webhook routes
    fastify.register(ClerkWebhookRoutes);

    // Register additional routes here as the API grows
}