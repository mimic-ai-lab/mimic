import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { getDatabaseUrl } from './env';
import { logger } from './logger';

/**
 * Generic database interface for Kysely
 * We use raw SQL execution, so we don't need specific table definitions
 */
export interface Database {
    [key: string]: any;
}

/**
 * Create database connection using Kysely
 */
export function createDatabase(): Kysely<Database> {
    const databaseUrl = getDatabaseUrl();
    logger.debug('Connecting to database:', databaseUrl.replace(/\/\/.*@/, '//***:***@'));

    return new Kysely<Database>({
        dialect: new PostgresDialect({
            pool: new Pool({
                connectionString: databaseUrl,
                max: 10,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            }),
        }),
    });
}

/**
 * Create a direct Pool connection for raw SQL
 */
export function createPool(): Pool {
    const databaseUrl = getDatabaseUrl();
    logger.debug('Creating pool connection:', databaseUrl.replace(/\/\/.*@/, '//***:***@'));

    return new Pool({
        connectionString: databaseUrl,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
    try {
        const pool = createPool();
        await pool.query('SELECT 1');
        await pool.end();
        return true;
    } catch (error) {
        logger.error('Database connection failed:', error);
        return false;
    }
}

/**
 * Execute raw SQL statement using Pool
 * @param pool - Database pool
 * @param sqlStatement - SQL statement to execute
 */
export async function executeRawSql(pool: Pool, sqlStatement: string): Promise<void> {
    await pool.query(sqlStatement);
}

/**
 * Get database schema from the API folder
 */
export function getSchemaPath(): string {
    const { join } = require('path');
    return join(__dirname, '../../../../apps/api/src/lib/schema.sql');
}

/**
 * Read schema file content
 */
export function readSchema(): string {
    const { readFileSync } = require('fs');
    const schemaPath = getSchemaPath();

    try {
        return readFileSync(schemaPath, 'utf8');
    } catch (error) {
        throw new Error(`Failed to read schema file at ${schemaPath}: ${error}`);
    }
} 