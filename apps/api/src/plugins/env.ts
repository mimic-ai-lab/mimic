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
import { envSchema } from '@/types/env';


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