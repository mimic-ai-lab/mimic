/**
 * Fastify type extensions for the Mimic API server.
 *
 * Extends Fastify's built-in types to include custom decorators
 * and request/response properties used throughout the application.
 */
import { type EnvConfig } from './env';

// Extend Fastify types to include env decorator
declare module 'fastify' {
    interface FastifyInstance {
        env: EnvConfig;
    }
    interface FastifyRequest {
        env: EnvConfig;
    }
} 