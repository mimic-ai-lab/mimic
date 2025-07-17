/**
 * Database configuration and connection setup.
 *
 * Provides a centralized Kysely database instance for PostgreSQL
 * that can be used throughout the application for database operations.
 */
import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

/**
 * Database interface defining the schema structure.
 * 
 * This interface should be extended as new tables are added to the database.
 * For now, we use `any` to allow flexibility during development.
 */
export interface Database {
    // Add table definitions here as they are created
    // Example:
    // users: UserTable;
    // sessions: SessionTable;
    [key: string]: any;
}

/**
 * Global database instance.
 * 
 * This instance is configured once and reused throughout the application
 * to maintain connection pooling and performance.
 */
let db: Kysely<Database>;

/**
 * Initialize the database connection.
 * 
 * Sets up a PostgreSQL connection using Kysely with connection pooling.
 * The connection is configured with appropriate timeouts and pool settings.
 * 
 * @throws {Error} If database connection fails
 */
export function initializeDatabase(): void {
    try {
        db = new Kysely<Database>({
            dialect: new PostgresDialect({
                pool: new pg.Pool({
                    connectionString: process.env.DATABASE_URL,
                    max: 10,
                    idleTimeoutMillis: 30000,
                    connectionTimeoutMillis: 2000,
                }),
            }),
        });
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
}

/**
 * Get the database instance.
 * 
 * Returns the configured Kysely database instance. If the database
 * hasn't been initialized yet, it will be initialized first.
 * 
 * @returns {Kysely<Database>} The database instance
 */
export function getDatabase(): Kysely<Database> {
    if (!db) {
        initializeDatabase();
    }
    return db;
}

/**
 * Close the database connection.
 * 
 * Properly closes the database connection pool. This should be called
 * when the application is shutting down to ensure clean resource cleanup.
 */
export async function closeDatabase(): Promise<void> {
    if (db) {
        await db.destroy();
    }
} 