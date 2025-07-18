/**
 * Registers all API routes for the Mimic server.
 *
 * @param {FastifyInstance} fastify - The Fastify server instance
 * @returns {Promise<void>}
 */
import { FastifyInstance } from 'fastify';

import HealthRoutes from '@/routes/health';

export default async function setupRoutes(fastify: FastifyInstance): Promise<void> {
    // Register health check routes (GET /health)
    fastify.register(HealthRoutes);


    // Register additional routes here as the API grows
}