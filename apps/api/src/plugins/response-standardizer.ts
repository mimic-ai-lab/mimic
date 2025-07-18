/**
 * Response standardizer plugin for Fastify.
 * 
 * Provides standardized success and error response helpers
 * that follow the platform's API response format.
 */
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { mapBetterAuthError } from '@/lib/response-helpers';

const responseStandardizerPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    // Add response helpers to fastify instance
    fastify.decorate('success', function (data: any, pagination?: any) {
        const response: any = { data };

        if (pagination) {
            response.pagination = pagination;
        }

        return response;
    });

    fastify.decorate('error', function (code: string, message: string, details?: any) {
        return {
            error: {
                code,
                message,
                details
            }
        };
    });

    // Global error handler for standardized error responses
    fastify.setErrorHandler((error, request, reply) => {
        fastify.log.error(error);

        // Map error to our standardized format
        const { code, message } = mapBetterAuthError(error);

        // Set appropriate status code
        const statusCode = error.statusCode || 500;
        reply.status(statusCode);

        // Send standardized error response
        reply.send(fastify.error(code, message, {
            timestamp: new Date().toISOString(),
            path: request.url
        }));
    });

    // Global response hook to ensure consistent formatting
    fastify.addHook('onSend', async (request, reply, payload) => {
        // Skip auth routes - Better Auth expects specific response formats
        if (request.url.startsWith('/api/auth')) {
            return payload;
        }

        // Skip if payload is already formatted (like our error responses)
        if (payload && typeof payload === 'object' &&
            ('data' in payload || 'error' in payload)) {
            return payload;
        }

        // For successful responses, wrap in our standard format
        if (reply.statusCode < 400 && payload) {
            return fastify.success(payload);
        }
    });
};

export default fp(responseStandardizerPlugin); 