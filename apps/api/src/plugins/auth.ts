import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getAuth } from '@clerk/fastify';
import fp from 'fastify-plugin';

/**
 * Authentication plugin for Fastify
 * 
 * Provides authentication middleware using Clerk's getAuth() function.
 * Can be used as a preHandler hook to protect routes.
 */
export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
    try {
        // Get authentication context from Clerk
        const { userId } = getAuth(request);

        // Check if user is authenticated
        if (!userId) {
            return reply.status(401).send({
                ok: false,
                error: 'Authentication required',
                code: 'UNAUTHENTICATED'
            });
        }

        // Get user details from database using clerk_id
        const users = await request.pg
            .selectFrom('users')
            .select(['id', 'clerk_id', 'email', 'first_name', 'last_name'])
            .where('clerk_id', '=', userId)
            .execute();

        const user = users[0];

        if (!user) {
            return reply.status(401).send({
                ok: false,
                error: 'User not found in database',
                code: 'USER_NOT_FOUND'
            });
        }

        // Add user context to request
        request.user = {
            id: user.id,
            email: user.email,
            firstName: user.first_name || undefined,
            lastName: user.last_name || undefined
        };

        request.log.debug('✅ User authenticated', {
            userId: user.id,
            clerkId: user.clerk_id,
            email: user.email
        });

    } catch (error) {
        request.log.error('❌ Authentication error', {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        return reply.status(401).send({
            ok: false,
            error: 'Authentication failed',
            code: 'AUTH_ERROR'
        });
    }
}

/**
 * Fastify plugin that registers the authentication function
 */
async function authPlugin(fastify: FastifyInstance) {
    // Decorate the request with the requireAuth function
    fastify.decorate('requireAuth', requireAuth);
}

// Export as a Fastify plugin
export default fp(authPlugin);

// Extend Fastify types to include the requireAuth decorator
declare module 'fastify' {
    interface FastifyInstance {
        requireAuth: typeof requireAuth;
    }
} 