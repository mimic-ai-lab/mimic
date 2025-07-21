/**
 * PostgreSQL database plugin for the Mimic API server.
 *
 * Provides a Kysely database connection with PostgreSQL support.
 * Uses connection pooling and proper error handling.
 */
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from '@mimic/core';

interface PostgresPluginOptions {
    url: string;
    pool?: {
        min?: number;
        max?: number;
        idleTimeoutMillis?: number;
    };
}

const postgresPlugin: FastifyPluginAsync<PostgresPluginOptions> = async (
    fastify: FastifyInstance,
    opts: PostgresPluginOptions
) => {
    try {
        // Create PostgreSQL pool
        const pool = new Pool({
            connectionString: opts.url,
            min: opts.pool?.min || 2,
            max: opts.pool?.max || 10,
            idleTimeoutMillis: opts.pool?.idleTimeoutMillis || 30000,
        });

        // Create Kysely instance
        const pg = new Kysely<Database>({
            dialect: new PostgresDialect({
                pool,
            }),
        });

        // Test the connection
        await pg.selectFrom('agents').select('id').limit(1).execute();

        // Decorate Fastify instance with PostgreSQL
        fastify.decorate('pg', pg);

        // Add hook to decorate each request with PostgreSQL
        fastify.addHook('onRequest', async (request) => {
            request.pg = pg;
        });

        // Graceful shutdown
        fastify.addHook('onClose', async () => {
            await pool.end();
        });

        fastify.log.info('PostgreSQL connection established successfully');
    } catch (error) {
        fastify.log.error('Failed to establish PostgreSQL connection:', error);
        throw error;
    }
};

export default fp(postgresPlugin); 