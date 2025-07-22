/**
 * Clerk webhook routes for user synchronization.
 *
 * Handles webhook events from Clerk and syncs user data to the local database.
 * Supports user.created, user.updated, and user.deleted events.
 *
 * @see https://clerk.com/docs/webhooks/overview
 */
import { FastifyInstance } from 'fastify';
import { handleClerkWebhook, handleWebhookHealthCheck } from './handlers';

export default async function clerkWebhookRoutes(fastify: FastifyInstance) {

    // Clerk webhook endpoint
    fastify.post('/webhooks/clerk', {
        schema: {
            description: 'Handle Clerk webhook events',
            tags: ['webhooks'],
            summary: 'Process Clerk user events',
            security: [
                {
                    webhookSecret: []
                }
            ],
            body: {
                type: 'object',
                description: 'Clerk webhook payload'
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        ok: { type: 'boolean' },
                        message: { type: 'string' },
                        eventType: { type: 'string' },
                        userId: { type: 'string' },
                        processingTimeMs: { type: 'number' }
                    }
                },
                400: {
                    type: 'object',
                    properties: {
                        ok: { type: 'boolean' },
                        error: { type: 'string' },
                        code: { type: 'string' },
                        details: { type: 'object' }
                    }
                },
                401: {
                    type: 'object',
                    properties: {
                        ok: { type: 'boolean' },
                        error: { type: 'string' },
                        code: { type: 'string' }
                    }
                },
                500: {
                    type: 'object',
                    properties: {
                        ok: { type: 'boolean' },
                        error: { type: 'string' },
                        code: { type: 'string' }
                    }
                }
            }
        },
        preHandler: async (request, reply) => {
            // Add security headers
            reply.header('X-Content-Type-Options', 'nosniff');
            reply.header('X-Frame-Options', 'DENY');
            reply.header('X-XSS-Protection', '1; mode=block');
            reply.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            reply.header('Content-Security-Policy', "default-src 'self'");

            // Validate content type
            const contentType = request.headers['content-type'];
            if (!contentType || !contentType.includes('application/json')) {
                return reply.status(400).send({
                    ok: false,
                    error: 'Invalid content type',
                    code: 'INVALID_CONTENT_TYPE',
                    details: {
                        expected: 'application/json',
                        received: contentType
                    }
                });
            }
        }
    }, handleClerkWebhook);

    // Health check endpoint for webhook monitoring
    fastify.get('/webhooks/clerk/health', {
        schema: {
            description: 'Health check for Clerk webhook endpoint',
            tags: ['webhooks', 'health'],
            summary: 'Check webhook endpoint health',
            response: {
                200: {
                    type: 'object',
                    properties: {
                        ok: { type: 'boolean' },
                        status: { type: 'string' },
                        checks: { type: 'object' },
                        service: { type: 'string' },
                        version: { type: 'string' }
                    }
                },
                503: {
                    type: 'object',
                    properties: {
                        ok: { type: 'boolean' },
                        status: { type: 'string' },
                        error: { type: 'string' },
                        checks: { type: 'object' },
                        service: { type: 'string' }
                    }
                }
            }
        }
    }, handleWebhookHealthCheck);
} 