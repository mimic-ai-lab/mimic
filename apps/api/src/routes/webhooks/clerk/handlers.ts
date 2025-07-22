/**
 * Clerk webhook request handlers.
 *
 * Handles webhook signature verification and event processing.
 */
import { FastifyRequest, FastifyReply } from 'fastify';
import { Webhook } from 'svix';
import { WebhookEventSchema, UserCreatedSchemaType, UserDeletedSchemaType } from './schema';
import { handleUserCreated, handleUserUpdated, handleUserDeleted } from './utils';

// Webhook event types for type safety
type WebhookEventType = 'user.created' | 'user.updated' | 'user.deleted';

// Error response structure
interface WebhookErrorResponse {
    ok: false;
    error: string;
    code?: string;
    details?: Record<string, any>;
}

/**
 * Handle Clerk webhook POST request
 */
export async function handleClerkWebhook(request: FastifyRequest, reply: FastifyReply) {
    const startTime = Date.now();

    request.log.info('🔄 Clerk webhook received', {
        method: request.method,
        url: request.url,
        bodySize: request.body ? JSON.stringify(request.body).length : 0,
        reqId: request.reqID
    });

    try {
        // Extract Svix headers for signature verification
        const svixId = request.headers['svix-id'] as string;
        const svixTimestamp = request.headers['svix-timestamp'] as string;
        const svixSignature = request.headers['svix-signature'] as string;

        request.log.debug('🔐 Svix headers extracted', { svixId, svixTimestamp, hasSignature: !!svixSignature });

        // Validate required headers
        if (!svixId || !svixTimestamp || !svixSignature) {
            const error: WebhookErrorResponse = {
                ok: false,
                error: 'Missing required Svix headers',
                code: 'MISSING_HEADERS',
                details: {
                    required: ['svix-id', 'svix-timestamp', 'svix-signature'],
                    received: { svixId: !!svixId, svixTimestamp: !!svixTimestamp, svixSignature: !!svixSignature }
                }
            };

            request.log.warn('⚠️ Missing Svix headers in webhook request', error.details);
            return reply.status(400).send(error);
        }

        // Get webhook secret from environment
        const secret = process.env.CLERK_WEBHOOK_SECRET;
        request.log.debug('🔑 Webhook secret check', { hasSecret: !!secret });

        if (!secret) {
            const error: WebhookErrorResponse = {
                ok: false,
                error: 'Webhook secret not configured',
                code: 'MISSING_SECRET'
            };

            request.log.error('❌ CLERK_WEBHOOK_SECRET not configured');
            return reply.status(500).send(error);
        }

        // Verify webhook signature (commented for testing)
        const payload = JSON.stringify(request.body);
        request.log.debug('📦 Webhook payload prepared', { payloadLength: payload.length });

        // Verify webhook signature using Svix
        const webhook = new Webhook(secret);
        let event: any;
        try {
            event = webhook.verify(payload, {
                'svix-id': svixId,
                'svix-timestamp': svixTimestamp,
                'svix-signature': svixSignature,
            });
            request.log.debug('✅ Webhook signature verified successfully');
        } catch (err) {
            request.log.error('❌ Webhook signature verification failed', { error: err });
            return reply.status(401).send({
                ok: false,
                error: 'Invalid webhook signature',
                code: 'INVALID_SIGNATURE'
            });
        }

        // Parse and validate the event
        request.log.debug('📋 Raw webhook event', { event });
        request.log.info('🔍 Parsing webhook event', {
            eventType: event?.type,
            eventObject: event?.object,
            hasData: !!event?.data
        });

        request.log.debug('✅ Attempting to parse webhook event with schema');
        const parsedEvent = WebhookEventSchema.safeParse(event);
        if (!parsedEvent.success) {
            const error: WebhookErrorResponse = {
                ok: false,
                error: 'Invalid webhook event format',
                code: 'INVALID_PAYLOAD',
                details: {
                    errors: parsedEvent.error.issues,
                    receivedEvent: event,
                    errorDetails: parsedEvent.error.format()
                }
            };

            request.log.warn('⚠️ Invalid webhook event format', error.details);
            return reply.status(400).send(error);
        }

        request.log.debug('✅ Webhook event parsed successfully', { parsedEvent: parsedEvent.data });

        const { data: user, type: eventType } = parsedEvent.data;
        request.log.info('✅ Webhook event parsed successfully', { eventType, userId: user.id });

        // Validate event type
        const validEventTypes: WebhookEventType[] = ['user.created', 'user.updated', 'user.deleted'];
        if (!validEventTypes.includes(eventType as WebhookEventType)) {
            const error: WebhookErrorResponse = {
                ok: false,
                error: `Unsupported event type: ${eventType}`,
                code: 'UNSUPPORTED_EVENT',
                details: {
                    eventType,
                    supportedTypes: validEventTypes
                }
            };

            request.log.warn('⚠️ Unsupported webhook event type', { eventType });
            return reply.status(400).send(error);
        }

        // Handle different event types
        request.log.info('🔄 Processing webhook event type', { eventType, userId: user.id });

        try {
            switch (eventType) {
                case 'user.created':
                    request.log.info('👤 Handling user.created event');
                    await handleUserCreated(request, user as UserCreatedSchemaType);
                    break;
                case 'user.updated':
                    request.log.info('🔄 Handling user.updated event');
                    await handleUserUpdated(request, user as UserCreatedSchemaType);
                    break;
                case 'user.deleted':
                    request.log.info('🗑️ Handling user.deleted event');
                    await handleUserDeleted(request, user as UserDeletedSchemaType);
                    break;
                default:
                    // This should never happen due to validation above
                    throw new Error(`Unhandled event type: ${eventType}`);
            }

            const processingTime = Date.now() - startTime;
            request.log.info('✅ Webhook processed successfully', {
                eventType,
                userId: user.id,
                processingTimeMs: processingTime
            });

            return reply.status(200).send({
                ok: true,
                message: `Successfully processed ${eventType}`,
                eventType,
                userId: user.id,
                processingTimeMs: processingTime
            });

        } catch (error) {
            const processingTime = Date.now() - startTime;
            request.log.error('❌ Error processing webhook event', {
                eventType,
                userId: user.id,
                error: error instanceof Error ? error.message : error,
                stack: error instanceof Error ? error.stack : undefined,
                processingTimeMs: processingTime
            });

            return reply.status(500).send({
                ok: false,
                error: 'Failed to process webhook event',
                code: 'PROCESSING_ERROR',
                details: {
                    eventType,
                    userId: user.id,
                    error: error instanceof Error ? error.message : 'Unknown error'
                }
            });
        }

    } catch (error) {
        const processingTime = Date.now() - startTime;
        request.log.error('❌ Unexpected error in webhook handler', {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            processingTimeMs: processingTime
        });

        return reply.status(500).send({
            ok: false,
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
}

/**
 * Health check endpoint for Clerk webhook
 * 
 * This endpoint allows monitoring systems to verify that:
 * 1. The webhook endpoint is accessible
 * 2. Database connection is working
 * 3. Required environment variables are set
 */
export async function handleWebhookHealthCheck(request: FastifyRequest, reply: FastifyReply) {
    const checks = {
        endpoint: true,
        database: false,
        environment: false,
        timestamp: new Date().toISOString()
    };

    try {
        // Check database connection
        try {
            await request.pg.selectFrom('users').select('id').limit(1).execute();
            checks.database = true;
        } catch (dbError) {
            request.log.warn('Database health check failed', { error: dbError });
        }

        // Check required environment variables
        const requiredEnvVars = ['CLERK_WEBHOOK_SECRET', 'DATABASE_URL'];
        const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

        if (missingEnvVars.length === 0) {
            checks.environment = true;
        } else {
            request.log.warn('Missing environment variables', { missing: missingEnvVars });
        }

        const isHealthy = checks.endpoint && checks.database && checks.environment;
        const statusCode = isHealthy ? 200 : 503;

        return reply.status(statusCode).send({
            ok: isHealthy,
            status: isHealthy ? 'healthy' : 'unhealthy',
            checks,
            service: 'clerk-webhook',
            version: process.env.npm_package_version || '1.0.0'
        });

    } catch (error) {
        request.log.error('Health check failed', { error });

        return reply.status(503).send({
            ok: false,
            status: 'unhealthy',
            error: 'Health check failed',
            checks,
            service: 'clerk-webhook'
        });
    }
} 