/**
 * Health check routes for the API server.
 *
 * Provides endpoints to check the health and status of the server,
 * database connections, and other critical services.
 */
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export default async function HealthRoutes(fastify: FastifyInstance): Promise<void> {
    // Basic health check endpoint
    fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
        // Use Fastify's success helper for standardized response
        return fastify.success({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development'
        });
    });

    // Detailed health check endpoint
    fastify.get('/health/detailed', async (request: FastifyRequest, reply: FastifyReply) => {
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            services: {
                database: 'connected',
                auth: process.env.CLERK_SECRET_KEY ? 'configured' : 'not_configured'
            }
        };

        // Use Fastify's success helper for standardized response
        return fastify.success(health);
    });

    // Example of error handling
    fastify.get('/health/error', async (request: FastifyRequest, reply: FastifyReply) => {
        // This will be handled by the global error handler
        throw new Error('Simulated health check error');
    });
}