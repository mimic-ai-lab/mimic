import { Command } from 'commander';
import { logger } from '../utils/logger';
import { createDatabase, createPool, readSchema, testConnection, executeRawSql } from '../utils/database';
import { validateDatabaseConfig } from '../utils/env';

/**
 * Migration command options interface
 */
interface MigrateCommandOptions {
    reset?: boolean;
    dryRun?: boolean;
    force?: boolean;
}

/**
 * Database migration status
 */
interface MigrationStatus {
    pending: number;
    completed: number;
    failed: number;
}

/**
 * Add migrate command to the CLI program
 * @param program - The commander program instance
 */
export function migrateCommand(program: Command): void {
    program
        .command('migrate')
        .description('Migrate database schema')
        .option('--reset', 'Reset database (drop all tables)')
        .option('--dry-run', 'Show what would be executed without running')
        .option('--force', 'Force migration even if there are warnings')
        .action(async (options: MigrateCommandOptions) => {
            try {
                await handleMigration(options);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown migration error';
                logger.error('Migration failed:', errorMessage);
                process.exit(1);
            }
        });
}

/**
 * Handle the migration process
 * @param options - Migration command options
 */
async function handleMigration(options: MigrateCommandOptions): Promise<void> {
    logger.info('Starting database migration...');

    // Validate database configuration
    if (!validateDatabaseConfig()) {
        logger.error('Database configuration not found. Please check your environment variables.');
        logger.info('Required: DATABASE_URL or individual database environment variables');
        process.exit(1);
    }

    if (options.dryRun) {
        logger.info('Running in dry-run mode - no changes will be made');
        await performDryRun();
        return;
    }

    if (options.reset) {
        logger.warn('Reset mode enabled - this will drop all tables!');
        if (!options.force) {
            logger.error('Use --force to confirm database reset');
            process.exit(1);
        }
        await performReset();
        return;
    }

    await performMigration();
}

/**
 * Perform a dry run of the migration
 */
async function performDryRun(): Promise<void> {
    logger.info('Analyzing migration requirements...');

    try {
        const schema = readSchema();
        const statements = parseSchemaStatements(schema);

        const status: MigrationStatus = {
            pending: statements.length,
            completed: 0,
            failed: 0,
        };

        displayMigrationStatus(status, true);
        logger.info('Schema statements to be executed:');
        statements.forEach((stmt, index) => {
            logger.info(`  ${index + 1}. ${stmt.substring(0, 50)}...`);
        });

        logger.success('Dry run completed - no changes made');
    } catch (error) {
        logger.error('Failed to analyze schema:', error);
        process.exit(1);
    }
}

/**
 * Perform database reset
 */
async function performReset(): Promise<void> {
    logger.warn('Dropping all database tables...');

    try {
        const pool = createPool();

        // Drop all tables
        await executeRawSql(pool, 'DROP SCHEMA IF EXISTS public CASCADE');
        await executeRawSql(pool, 'CREATE SCHEMA public');
        await executeRawSql(pool, 'GRANT ALL ON SCHEMA public TO public');

        await pool.end();

        logger.success('Database reset completed');
        logger.info('All tables have been dropped');
    } catch (error) {
        logger.error('Failed to reset database:', error);
        process.exit(1);
    }
}

/**
 * Perform normal migration
 */
async function performMigration(): Promise<void> {
    logger.info('Running database migrations...');

    try {
        // Test connection first
        const isConnected = await testConnection();
        if (!isConnected) {
            logger.error('Cannot connect to database. Please check your configuration.');
            process.exit(1);
        }

        const pool = createPool();
        const schema = readSchema();
        const statements = parseSchemaStatements(schema);

        let completed = 0;
        let failed = 0;

        for (const statement of statements) {
            try {
                await executeRawSql(pool, statement);
                completed++;
                logger.debug('Executed statement successfully');
            } catch (error) {
                failed++;
                logger.error('Failed to execute statement:', error);
            }
        }

        await pool.end();

        const status: MigrationStatus = {
            pending: 0,
            completed,
            failed,
        };

        displayMigrationStatus(status, false);

        if (failed > 0) {
            logger.error('Migration completed with errors');
            process.exit(1);
        } else {
            logger.success('Migration completed successfully');
        }
    } catch (error) {
        logger.error('Migration failed:', error);
        process.exit(1);
    }
}

/**
 * Parse schema SQL into individual statements
 * @param schema - The schema SQL content
 * @returns Array of SQL statements
 */
function parseSchemaStatements(schema: string): string[] {
    // Remove comments and split by semicolons
    const cleanSchema = schema
        .replace(/--.*$/gm, '') // Remove single line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .trim();

    return cleanSchema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0)
        .map(stmt => stmt + ';');
}

/**
 * Display migration status
 * @param status - Migration status information
 * @param isDryRun - Whether this is a dry run
 */
function displayMigrationStatus(status: MigrationStatus, isDryRun: boolean): void {
    const prefix = isDryRun ? '[DRY RUN] ' : '';

    console.log();
    console.log(`${prefix}Migration Status:`);
    console.log(`  Pending:   ${status.pending}`);
    console.log(`  Completed:  ${status.completed}`);
    console.log(`  Failed:     ${status.failed}`);
    console.log();
} 