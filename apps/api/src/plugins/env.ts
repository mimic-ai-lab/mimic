/**
 * Environment validation plugin for the Mimic API server.
 *
 * Validates required environment variables and provides type-safe access
 * to configuration values throughout the application.
 */
import { FastifyInstance, FastifyPluginAsync, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { z } from 'zod';
import { envSchema, type EnvConfig } from '@/types/env';

const envPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    try {
        const config = envSchema.parse(process.env);

        // Decorate FastifyInstance with validated config
        fastify.decorate('env', config);

        // Add hook to decorate each request with env config
        fastify.addHook('onRequest', async (request: FastifyRequest) => {
            request.env = config;
        });

        fastify.log.info('Environment validation successful');
    } catch (error) {
        if (error instanceof z.ZodError) {
            fastify.log.error('Environment validation failed:');
            error.issues.forEach((issue: z.ZodIssue) => {
                fastify.log.error(`- ${issue.path.join('.')}: ${issue.message}`);
            });
            throw new Error('Environment validation failed');
        }
        throw error;
    }
};

export default fp(envPlugin); 