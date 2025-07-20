import { Command } from 'commander';
import { logger } from '../utils/logger';

/**
 * Configuration command options interface
 */
interface ConfigCommandOptions {
    global?: boolean;
    force?: boolean;
}

/**
 * Configuration value interface
 */
interface ConfigValue {
    key: string;
    value: string;
    type: 'string' | 'number' | 'boolean' | 'json';
}

/**
 * Configuration file interface
 */
interface ConfigFile {
    version: string;
    database?: {
        url?: string;
        host?: string;
        port?: number;
        name?: string;
        username?: string;
        password?: string;
    };
    api?: {
        port?: number;
        host?: string;
        cors?: string[];
    };
    auth?: {
        secret?: string;
        issuer?: string;
    };
}

/**
 * Add config command to the CLI program
 * @param program - The commander program instance
 */
export function configCommand(program: Command): void {
    const configCmd = program
        .command('config')
        .description('Manage configuration');

    // Show configuration
    configCmd
        .command('show')
        .description('Show current configuration')
        .option('--global', 'Show global configuration')
        .action(async (options: ConfigCommandOptions) => {
            try {
                await showConfiguration(options);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown config error';
                logger.error('Failed to show configuration:', errorMessage);
                process.exit(1);
            }
        });

    // Set configuration value
    configCmd
        .command('set')
        .description('Set configuration value')
        .argument('<key>', 'Configuration key')
        .argument('<value>', 'Configuration value')
        .option('--global', 'Set global configuration')
        .option('--force', 'Force overwrite existing value')
        .action(async (key: string, value: string, options: ConfigCommandOptions) => {
            try {
                await setConfiguration(key, value, options);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown config error';
                logger.error('Failed to set configuration:', errorMessage);
                process.exit(1);
            }
        });

    // Initialize configuration
    configCmd
        .command('init')
        .description('Initialize configuration')
        .option('--global', 'Initialize global configuration')
        .option('--force', 'Force overwrite existing configuration')
        .action(async (options: ConfigCommandOptions) => {
            try {
                await initializeConfiguration(options);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown config error';
                logger.error('Failed to initialize configuration:', errorMessage);
                process.exit(1);
            }
        });
}

/**
 * Show current configuration
 * @param options - Command options
 */
async function showConfiguration(options: ConfigCommandOptions): Promise<void> {
    logger.info('Loading configuration...');

    const config = await loadConfiguration(options.global);

    console.log();
    console.log('Configuration:');
    console.log('=============');

    displayConfigSection('Database', config.database);
    displayConfigSection('API', config.api);
    displayConfigSection('Auth', config.auth);

    logger.success('Configuration loaded successfully');
}

/**
 * Set configuration value
 * @param key - Configuration key
 * @param value - Configuration value
 * @param options - Command options
 */
async function setConfiguration(key: string, value: string, options: ConfigCommandOptions): Promise<void> {
    logger.info(`Setting configuration: ${key} = ${value}`);

    const config = await loadConfiguration(options.global);
    const parsedValue = parseConfigValue(key, value);

    // Update configuration based on key path
    updateConfigValue(config, key, parsedValue);

    await saveConfiguration(config, options.global);

    logger.success(`Configuration updated: ${key} = ${value}`);
}

/**
 * Initialize configuration
 * @param options - Command options
 */
async function initializeConfiguration(options: ConfigCommandOptions): Promise<void> {
    logger.info('Initializing configuration...');

    const defaultConfig: ConfigFile = {
        version: '1.0.0',
        database: {
            host: 'localhost',
            port: 5432,
            name: 'mimic',
            username: 'postgres',
        },
        api: {
            port: 3000,
            host: 'localhost',
            cors: ['http://localhost:3000'],
        },
        auth: {
            issuer: 'mimic',
        },
    };

    await saveConfiguration(defaultConfig, options.global);

    logger.success('Configuration initialized successfully');
    logger.info('Edit the configuration file to customize settings');
}

/**
 * Load configuration from file
 * @param global - Whether to load global configuration
 * @returns Configuration object
 */
async function loadConfiguration(global?: boolean): Promise<ConfigFile> {
    // Simulate loading configuration
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        version: '1.0.0',
        database: {
            host: 'localhost',
            port: 5432,
            name: 'mimic',
        },
        api: {
            port: 3000,
            host: 'localhost',
        },
        auth: {
            issuer: 'mimic',
        },
    };
}

/**
 * Save configuration to file
 * @param config - Configuration object
 * @param global - Whether to save global configuration
 */
async function saveConfiguration(config: ConfigFile, global?: boolean): Promise<void> {
    // Simulate saving configuration
    await new Promise(resolve => setTimeout(resolve, 300));
    logger.debug('Configuration saved');
}

/**
 * Parse configuration value based on key
 * @param key - Configuration key
 * @param value - Raw value string
 * @returns Parsed value
 */
function parseConfigValue(key: string, value: string): unknown {
    // Try to parse as JSON first
    try {
        return JSON.parse(value);
    } catch {
        // Try to parse as number
        if (!isNaN(Number(value)) && value.trim() !== '') {
            return Number(value);
        }
        // Try to parse as boolean
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
        // Default to string
        return value;
    }
}

/**
 * Update configuration value at the specified key path
 * @param config - Configuration object
 * @param key - Configuration key (supports dot notation)
 * @param value - Value to set
 */
function updateConfigValue(config: ConfigFile, key: string, value: unknown): void {
    const keys = key.split('.');
    let current: any = config;

    for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!current[k]) {
            current[k] = {};
        }
        current = current[k];
    }

    current[keys[keys.length - 1]] = value;
}

/**
 * Display a configuration section
 * @param title - Section title
 * @param data - Section data
 */
function displayConfigSection(title: string, data?: Record<string, unknown>): void {
    if (!data || Object.keys(data).length === 0) {
        return;
    }

    console.log(`\n${title}:`);
    Object.entries(data).forEach(([key, value]) => {
        const displayValue = typeof value === 'string' && value.length > 50
            ? value.substring(0, 50) + '...'
            : value;
        console.log(`  ${key}: ${displayValue}`);
    });
} 