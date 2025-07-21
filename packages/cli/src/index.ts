#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { version } from '../package.json';
import { helpCommand } from './commands/help';
import { migrateCommand } from './commands/migrate';
import { configCommand } from './commands/config';
import { logger } from './utils/logger';

// Initialize the CLI program
const program = new Command();

// Set up the main program with proper error handling
program
    .name('mimic')
    .description('Mimic CLI - Agent simulation platform command line interface')
    .version(version, '-v, --version')
    .option('-d, --debug', 'Enable debug logging')
    .hook('preAction', (thisCommand) => {
        // Set up debug logging if enabled
        const options = thisCommand.opts();
        if (options.debug) {
            logger.setLevel('debug');
            logger.debug('Debug mode enabled');
        }
    })
    .exitOverride((err) => {
        // Handle command parsing errors gracefully
        if (err.code === 'commander.help' || err.code === 'commander.helpDisplayed') {
            process.exit(0);
        }
        if (err.code === 'commander.version' || err.code === 'commander.versionDisplayed') {
            process.exit(0);
        }
        if (err.code === 'commander.help') {
            process.exit(0);
        }

        // Provide helpful error messages for common mistakes
        if (err.code === 'commander.unknownOption') {
            const option = err.message.match(/unknown option '([^']+)'/)?.[1];
            if (option) {
                logger.error(`Unknown option: ${option}`);
                logger.info('Use --help to see available options');
                logger.info(`Example: mimic ${program.args.join(' ')} --help`);
            } else {
                logger.error('Unknown option provided');
                logger.info('Use --help to see available options');
            }
            process.exit(1);
        }

        if (err.code === 'commander.unknownCommand') {
            const command = err.message.match(/unknown command '([^']+)'/)?.[1];
            if (command) {
                logger.error(`Unknown command: ${command}`);
                logger.info('Use "mimic help" to see all available commands');
                logger.info('Use "mimic help <command>" to see help for a specific command');
            } else {
                logger.error('Unknown command provided');
                logger.info('Use "mimic help" to see all available commands');
            }
            process.exit(1);
        }

        // Only log errors for actual command failures
        if (err.code !== 'commander.help' && err.code !== 'commander.version') {
            logger.error('Command failed:', err.message);
            logger.info('Use --help for more information');
            process.exit(1);
        }
        process.exit(0);
    });

// Add commands
helpCommand(program);
migrateCommand(program);
configCommand(program);

// Global error handlers for uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught exception:', error.message);
    if (process.env.NODE_ENV === 'development') {
        console.error(error.stack);
    }
    process.exit(1);
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    logger.error('Unhandled rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Graceful shutdown handling
process.on('SIGINT', () => {
    logger.info('Received SIGINT, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    logger.info('Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

/**
 * Main CLI entry point
 * Handles command parsing and execution
 */
async function main(): Promise<void> {
    try {
        await program.parseAsync();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        logger.error('Failed to parse command:', errorMessage);
        logger.info('Use "mimic help" for more information');
        process.exit(1);
    }
}

// Only run if this file is being executed directly
if (require.main === module) {
    main().catch((error) => {
        logger.error('CLI execution failed:', error);
        process.exit(1);
    });
}

export { program }; 