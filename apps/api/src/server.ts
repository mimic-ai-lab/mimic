/**
 * Main entry point for the Mimic API server.
 *
 * - Sets up Sentry for error tracking and profiling
 * - Configures Fastify server with logging
 * - Registers plugins and routes
 * - Handles CORS and error monitoring
 *
 * This file is designed for clarity and maintainability in an open source context.
 */

import * as Sentry from "@sentry/node";

/**
 * Initialize Sentry for error tracking and performance profiling.
 * DSN and environment are loaded from environment variables.
 */
Sentry.init({
    dsn: process.env.SENTRY_DSN, // Set your Sentry DSN here
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
});

// Tag all Sentry events with platform info
Sentry.setTag("platform", "backend");

import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

import setupPlugins from '@/plugins';
import setupRoutes from '@/routes';
import { initializeDatabase, closeDatabase } from '@/lib';

/**
 * Create and configure the Fastify server instance.
 *
 * - Pretty logging with @mgcrea/pino-pretty-compact in development
 * - Simple logging in test/production environments
 * - Disables request logging by default
 */
const fastify = Fastify({
    logger: {
        level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    },
    disableRequestLogging: true, // Let custom logger handle request logging
});

// Initialize database connection
initializeDatabase();

// Register all plugins (CORS, etc.)
setupPlugins(fastify);

// Register all API routes
setupRoutes(fastify);



// Sentry error handling is handled automatically through the integration

/**
 * Build and configure the Fastify server for testing.
 * 
 * @returns {Promise<FastifyInstance>} Configured Fastify instance
 */
export async function build(): Promise<FastifyInstance> {
    return fastify;
}

/**
 * Start the Fastify server.
 *
 * - Listens on the port specified by the PORT environment variable (default: 4001)
 * - Binds to 0.0.0.0 for Docker/VM compatibility
 * - Logs errors and exits on failure
 */
const start = async () => {
    try {
        const port = process.env.API_SERVER_PORT ? parseInt(process.env.API_SERVER_PORT, 10) : 4000;
        await fastify.listen({ port, host: '0.0.0.0' });
        console.log(`Server running at http://0.0.0.0:${port}`);
    } catch (err) {
        console.error("Server startup failed:", err);
        fastify.log.error(err);
        process.exit(1);
    }
};

// Graceful shutdown handling
process.on('SIGINT', async () => {
    console.log('Received SIGINT, shutting down gracefully...');
    await closeDatabase();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    await closeDatabase();
    process.exit(0);
});

// Start the server
start();