/**
 * Registers core Fastify plugins.
 *
 * @param {FastifyInstance} fastify - Fastify server instance
 * @returns {Promise<void>}
 */
import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import envPlugin from './env';
import postgresPlugin from './postgres';
import responseStandardizer from './response-standardizer';
import { clerkPlugin } from '@clerk/fastify';
import loggerPlugin from './logger';
import authPlugin from './auth';

export default async function setupPlugins(fastify: FastifyInstance): Promise<void> {
    // Register environment plugin first
    await fastify.register(envPlugin);

    // Register PostgreSQL plugin after environment is loaded
    await fastify.register(postgresPlugin, {
        url: fastify.env.DATABASE_URL,
        pool: {
            min: 2,
            max: 10,
            idleTimeoutMillis: 30000,
        },
    });

    // Register response standardizer plugin
    // await fastify.register(responseStandardizer);

    // Configure CORS policies for Better Auth
    await fastify.register(cors, {
        origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With"
        ],
        credentials: true,
        maxAge: 86400
    });

    await fastify.register(clerkPlugin);

    // Register custom logger plugin
    await fastify.register(loggerPlugin, {
        logBody: process.env.NODE_ENV === 'development',
        logResponseTime: true,
        ignoredPaths: ["/health", /^\/static/], // Ignore specific paths
        ignore: (request) => request.headers["x-no-log"] === "true", // Custom ignore logic
    });

    // Register authentication plugin
    await fastify.register(authPlugin);

    // Register additional plugins here as needed
}