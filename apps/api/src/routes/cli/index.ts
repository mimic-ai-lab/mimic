import { FastifyInstance } from 'fastify';
import cliAgentRoutes from './agents';

/**
 * CLI Routes
 * 
 * Provides API endpoints specifically for CLI operations using API key authentication.
 * These routes are separate from dashboard routes and use different authentication
 * and validation patterns.
 */
export default async function CLIRoutes(fastify: FastifyInstance): Promise<void> {
    // Add a simple test route
    fastify.get('/test', async (request, reply) => {
        return { message: 'CLI routes are working!' };
    });

    // Register CLI agent routes
    await fastify.register(cliAgentRoutes, { prefix: '/agents' });
} 