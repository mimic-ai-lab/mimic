import { join } from 'path';

/**
 * Database configuration interface
 */
export interface DatabaseConfig {
    url?: string;
    host?: string;
    port?: number;
    name?: string;
    username?: string;
    password?: string;
}

/**
 * Get database configuration from environment variables
 * Environment variables are loaded via bash script in development
 */
export function getDatabaseConfig(): DatabaseConfig {
    return {
        url: process.env.DATABASE_URL,
        host: process.env.DB_HOST || process.env.POSTGRES_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
        name: process.env.DB_NAME || process.env.POSTGRES_DB,
        username: process.env.DB_USER || process.env.POSTGRES_USER,
        password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD,
    };
}

/**
 * Get database URL, preferring DATABASE_URL over individual components
 */
export function getDatabaseUrl(): string {
    const config = getDatabaseConfig();

    if (config.url) {
        return config.url;
    }

    if (config.host && config.name) {
        const auth = config.username && config.password
            ? `${config.username}:${config.password}@`
            : '';
        return `postgresql://${auth}${config.host}:${config.port}/${config.name}`;
    }

    throw new Error('Database configuration not found. Please set DATABASE_URL or individual database environment variables.');
}

/**
 * Validate database configuration
 */
export function validateDatabaseConfig(): boolean {
    try {
        getDatabaseUrl();
        return true;
    } catch {
        return false;
    }
} 