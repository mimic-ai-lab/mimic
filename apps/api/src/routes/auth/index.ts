/**
 * Authentication routes for Better Auth integration.
 *
 * This module provides a Fastify route handler that acts as a proxy between
 * the client and Better Auth's authentication system. It handles all authentication
 * requests including magic link signup/signin, session management, and logout.
 *
 * The route accepts both GET and POST requests to `/api/auth/*` and forwards
 * them to Better Auth's handler, then returns the response to the client.
 *
 * @see {@link https://better-auth.com/docs/guides/fastify} Better Auth Fastify Guide
 */
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { auth } from '@/lib';

/**
 * Registers authentication routes with the Fastify instance.
 *
 * Creates a catch-all route at `/api/auth/*` that handles all authentication
 * requests by proxying them to Better Auth's handler. This includes:
 * - Magic link signup/signin
 * - Session management
 * - Logout
 * - Account management
 *
 * @param fastify - The Fastify instance to register routes with
 */
export default async function AuthRoutes(fastify: FastifyInstance): Promise<void> {
    // Register authentication endpoint
    fastify.route({
        method: ["GET", "POST"],
        url: "/api/auth/*",
        async handler(request: FastifyRequest, reply: FastifyReply) {
            try {
                // Construct request URL with proper host handling
                const host = request.headers.host || 'localhost';
                const url = new URL(request.url, `http://${host}`);

                // Convert Fastify headers to standard Headers object
                const headers = new Headers();
                Object.entries(request.headers).forEach(([key, value]: [string, any]) => {
                    if (value) {
                        // Handle array values by joining with comma
                        const headerValue = Array.isArray(value) ? value.join(', ') : value.toString();
                        headers.append(key, headerValue);
                    }
                });

                // Create Fetch API-compatible request
                const req = new Request(url.toString(), {
                    method: request.method,
                    headers,
                    body: request.body ? JSON.stringify(request.body) : undefined,
                });

                // Process authentication request through Better Auth
                const response = await auth.handler(req);

                // Debug: Log response headers
                console.log('Better Auth Response Status:', response.status);
                console.log('Better Auth Response Headers:');
                response.headers.forEach((value: string, key: string) => {
                    console.log(`  ${key}: ${value}`);
                });

                // Forward response to client
                reply.status(response.status);

                // Copy all response headers, especially Set-Cookie headers
                response.headers.forEach((value: string, key: string) => {
                    if (key.toLowerCase() === 'set-cookie') {
                        // Handle Set-Cookie headers specially
                        console.log(`Setting cookie: ${key} = ${value}`);
                        reply.header(key, value);
                    } else {
                        reply.header(key, value);
                    }
                });

                // Send response body if present
                const responseBody = response.body ? await response.text() : null;
                reply.send(responseBody);

            } catch (error) {
                fastify.log.error("Authentication Error:", error);
                reply.status(500).send({
                    error: "Internal authentication error",
                    code: "AUTH_FAILURE"
                });
            }
        }
    });
} 