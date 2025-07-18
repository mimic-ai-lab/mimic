/**
 * Environment validation plugin for the Mimic API server.
 *
 * Validates required environment variables and provides type-safe access
 * to configuration values throughout the application.
 */
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { z } from 'zod';
import '../types/fastify';

// Adapted schema for this project
const envSchema = z.object({
    // Database
    DATABASE_URL: z.string().url(),

    // Resend (Email Service)
    RESEND_API_KEY: z.string(),
    RESEND_FROM_EMAIL: z.string().email().default('noreply@mimic.dev'),

    // Better Auth
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string().url().default('http://localhost:4000'),

    // Server
    PORT: z.string().transform(Number).default(4000),
    NODE_ENV: z.string().default('development'),
    LOG_LEVEL: z.string().default('info'),

    // Sentry
    SENTRY_DSN: z.string().optional(),
});

type EnvConfig = z.infer<typeof envSchema>;
export type { EnvConfig };

const envPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    try {
        const configs = envSchema.parse(process.env);

        // Decorate the FastifyInstance
        fastify.decorate('env', configs);

        // Add a hook to decorate each request with the env
        fastify.addHook('onRequest', async (request) => {
            request.env = configs;
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Environment validation failed with the following errors:');
            error.issues.forEach((err: any) => {
                console.error(`- ${err.path.join('.')}: ${err.message}`);
            });
            throw new Error('Environment validation failed');
        }
        throw error;
    }
};

export default fp(envPlugin); 