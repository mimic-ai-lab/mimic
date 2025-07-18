/**
 * Test utilities for the Mimic API server.
 *
 * Provides simple helpers for creating test servers and making requests.
 */
import { FastifyInstance } from 'fastify';
import Fastify from 'fastify';

/**
 * Create a minimal test server.
 * 
 * @returns {Promise<FastifyInstance>} Configured Fastify instance for testing
 */
export async function createTestServer(): Promise<FastifyInstance> {
    const app = Fastify({
        logger: false, // Disable logging in tests
    });

    return app;
}

/**
 * Create a test server with specific routes.
 * 
 * @param {Function} routeHandler - Function to register routes
 * @returns {Promise<FastifyInstance>} Configured Fastify instance for testing
 */
export async function createTestServerWithRoutes(
    routeHandler: (app: FastifyInstance) => Promise<void>
): Promise<FastifyInstance> {
    const app = await createTestServer();
    await routeHandler(app);
    await app.ready();
    return app;
} 