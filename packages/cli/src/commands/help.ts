import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from '../utils/logger';

/**
 * Command interface for help command options
 */
interface HelpCommandOptions {
    command?: string;
}

/**
 * Display detailed help information for the Mimic CLI
 * @param program - The commander program instance
 */
export function helpCommand(program: Command): void {
    program
        .command('help')
        .description('Show detailed help information')
        .argument('[command]', 'Show help for specific command')
        .action(async (command?: string) => {
            if (command) {
                // Show help for specific command
                const cmd = program.commands.find(c => c.name() === command);
                if (cmd) {
                    cmd.help();
                } else {
                    logger.error(`Unknown command: ${command}`);
                    logger.info('Use "mimic help" to see all available commands');
                    process.exit(1);
                }
                return;
            }

            // Show general help
            displayGeneralHelp();
        });
}

/**
 * Display the general help information
 */
function displayGeneralHelp(): void {
    logger.info('Mimic CLI - Agent Simulation Platform');
    console.log();

    // Overview section
    displaySection('Overview', [
        'Mimic CLI provides tools to manage your agent simulation platform.',
        'From database migrations to agent deployment, everything you need',
        'to get your agents running in production.'
    ]);

    // Available commands section
    displaySection('Available Commands', []);

    // Database commands
    displayCommandGroup('Database Management', [
        'mimic migrate              Migrate database schema',
        'mimic migrate --reset     Reset database (drop all tables)',
        'mimic migrate --dry-run   Show what would be executed'
    ]);

    // Configuration commands
    displayCommandGroup('Configuration', [
        'mimic config set <key> <value>  Set configuration value',
        'mimic config show               Show current configuration',
        'mimic config init               Initialize configuration'
    ]);

    // Agent commands (future)
    displayCommandGroup('Agent Management (Coming Soon)', [
        'mimic agents list              List all agents',
        'mimic agents create            Create new agent',
        'mimic agents deploy <name>     Deploy agent to platform',
        'mimic agents run <name>        Run agent locally'
    ]);

    // Global options
    displaySection('Global Options', [
        '-v, --version    Show version number',
        '-d, --debug      Enable debug logging',
        '-h, --help       Show help information'
    ]);

    // Examples
    displaySection('Examples', [
        '# Initialize and migrate database',
        'mimic config init',
        'mimic migrate',
        '',
        '# Deploy an agent (future)',
        'mimic agents deploy my-agent --platform whatsapp',
        '',
        '# Run agent locally (future)',
        'mimic agents run my-agent --local'
    ]);

    // Getting help
    displaySection('Getting Help', [
        'mimic help <command>     Show help for specific command',
        'mimic <command> --help   Show help for specific command'
    ]);

    console.log();
    logger.success('For more information, visit: https://docs.mimic.ai');
}

/**
 * Display a section with title and content
 * @param title - The section title
 * @param lines - The content lines
 */
function displaySection(title: string, lines: string[]): void {
    console.log(chalk.bold.blue(title + ':'));
    lines.forEach(line => {
        if (line.trim()) {
            console.log('  ' + line);
        } else {
            console.log();
        }
    });
    console.log();
}

/**
 * Display a command group with title and commands
 * @param title - The group title
 * @param commands - The command descriptions
 */
function displayCommandGroup(title: string, commands: string[]): void {
    console.log(chalk.bold.green(title + ':'));
    commands.forEach(command => {
        console.log('  ' + command);
    });
    console.log();
} 