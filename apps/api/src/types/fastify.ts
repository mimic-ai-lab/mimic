/**
 * Fastify type extensions for the Mimic API server.
 *
 * Extends Fastify's built-in types to include custom decorators
 * and request/response properties used throughout the application.
 */
import { type EnvConfig } from './env';

// Extend Fastify types to include env decorator and response helpers
declare module 'fastify' {
    interface FastifyInstance {
        env: EnvConfig;
        success: (data: any, pagination?: any) => any;
        error: (code: string, message: string, details?: any) => any;
    }
    interface FastifyRequest {
        env: EnvConfig;
    }
} 