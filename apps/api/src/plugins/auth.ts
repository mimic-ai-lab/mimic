import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getAuth } from '@clerk/fastify';
import fp from 'fastify-plugin';
import crypto from 'crypto';

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
 * API Key authentication middleware for CLI routes
 * 
 * Validates API keys and sets team context on the request.
 * API keys are hashed for security and belong to teams.
 */
export async function requireApiKeyAuth(request: FastifyRequest, reply: FastifyReply) {
    try {
        const apiKeyHeader = request.headers['x-api-key'] || request.headers['authorization'];
        const apiKey = typeof apiKeyHeader === 'string'
            ? apiKeyHeader.replace('Bearer ', '')
            : Array.isArray(apiKeyHeader)
                ? apiKeyHeader[0]?.replace('Bearer ', '')
                : undefined;

        if (!apiKey) {
            return reply.status(401).send({
                ok: false,
                error: 'API key required',
                code: 'API_KEY_MISSING'
            });
        }

        // Validate API key format
        if (!apiKey.startsWith('mk_')) {
            return reply.status(401).send({
                ok: false,
                error: 'Invalid API key format',
                code: 'INVALID_API_KEY_FORMAT'
            });
        }

        // Hash the API key for database lookup
        const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
        const keyPrefix = apiKey.substring(0, 10);

        // Look up API key in database (using type assertion for now)
        const apiKeys = await (request.pg as any)
            .selectFrom('team_api_keys')
            .innerJoin('teams', 'teams.id', 'team_api_keys.team_id')
            .select([
                'team_api_keys.id',
                'team_api_keys.team_id',
                'team_api_keys.scope',
                'team_api_keys.is_active',
                'team_api_keys.expires_at',
                'teams.name as team_name'
            ])
            .where('team_api_keys.key_hash', '=', keyHash)
            .where('team_api_keys.key_prefix', '=', keyPrefix)
            .where('team_api_keys.is_active', '=', true)
            .execute();

        const apiKeyRecord = apiKeys[0];

        if (!apiKeyRecord) {
            return reply.status(401).send({
                ok: false,
                error: 'Invalid API key',
                code: 'INVALID_API_KEY'
            });
        }

        // Check if API key has expired
        if (apiKeyRecord.expires_at && new Date() > apiKeyRecord.expires_at) {
            return reply.status(401).send({
                ok: false,
                error: 'API key has expired',
                code: 'API_KEY_EXPIRED'
            });
        }

        // Update last used timestamp
        await (request.pg as any)
            .updateTable('team_api_keys')
            .set({ last_used_at: new Date() })
            .where('id', '=', apiKeyRecord.id)
            .execute();

        // Add team context to request
        request.team = {
            teamId: apiKeyRecord.team_id,
            teamName: apiKeyRecord.team_name
        };

        request.log.debug('✅ API key authenticated', {
            teamId: apiKeyRecord.team_id,
            teamName: apiKeyRecord.team_name,
            scope: apiKeyRecord.scope
        });

    } catch (error) {
        request.log.error('❌ API key authentication error', {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });

        return reply.status(401).send({
            ok: false,
            error: 'API key authentication failed',
            code: 'API_KEY_AUTH_ERROR'
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