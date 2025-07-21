# Mimic CLI

A professional command-line interface for the Mimic agent simulation platform. Built with TypeScript, Commander.js, and Chalk for a modern developer experience.

## Features

- **Database Management**: Migrate and manage database schemas
- **Configuration Management**: Set, view, and initialize configuration
- **Professional Logging**: Colored output with different log levels
- **Error Handling**: Graceful error handling and user-friendly messages
- **TypeScript**: Full type safety and IntelliSense support
- **Extensible**: Easy to add new commands and functionality

## Installation

```bash
# From the monorepo root
yarn install

# Build the CLI
yarn workspace @mimic/cli build
```

## Usage

### Basic Commands

```bash
# Show help
mimic --help

# Show detailed help
mimic help

# Show version
mimic --version

# Enable debug logging
mimic --debug <command>
```

### Database Management

```bash
# Run database migrations
mimic migrate

# Dry run migrations (see what would be executed)
mimic migrate --dry-run

# Reset database (drop all tables)
mimic migrate --reset --force
```

### Configuration Management

```bash
# Show current configuration
mimic config show

# Initialize configuration
mimic config init

# Set configuration value
mimic config set database.host localhost
mimic config set api.port 3000
mimic config set auth.secret "your-secret-key"
```

## Development

### Project Structure

```
src/
├── index.ts              # Main CLI entry point
├── commands/             # Command implementations
│   ├── help.ts          # Help command
│   ├── migrate.ts       # Database migration
│   └── config.ts        # Configuration management
└── utils/
    └── logger.ts        # Logging utility
```

### Adding New Commands

1. Create a new command file in `src/commands/`
2. Export a function that takes a `Command` instance
3. Register the command in `src/index.ts`

Example:

```typescript
// src/commands/example.ts
import { Command } from 'commander';
import { logger } from '../utils/logger';

export function exampleCommand(program: Command): void {
  program
    .command('example')
    .description('Example command')
    .action(async () => {
      logger.info('Example command executed');
    });
}
```

### Building

```bash
# Build for development
yarn dev

# Build for production
yarn build

# Run tests
yarn test

# Type checking
yarn type-check
```

### Code Quality

This package follows the monorepo's code quality standards:

- **Linting**: ESLint configuration from root
- **Formatting**: Prettier configuration from root
- **Type Checking**: TypeScript strict mode
- **Testing**: Jest for unit tests

Run from the monorepo root:

```bash
# Lint all packages
yarn lint

# Format all packages
yarn format

# Type check all packages
yarn type-check
```

## Architecture

### Command Structure

Each command follows a consistent pattern:

1. **Type Definitions**: Define interfaces for command options and data structures
2. **Command Registration**: Register the command with Commander.js
3. **Error Handling**: Wrap command logic in try-catch blocks
4. **Logging**: Use the logger utility for consistent output
5. **Validation**: Validate inputs and provide helpful error messages

### Logging

The CLI uses a custom logger with the following features:

- **Log Levels**: debug, info, warn, error, success
- **Colored Output**: Different colors for different log levels
- **Timestamps**: ISO timestamps for all log messages
- **Configurable**: Can disable colors or change log levels

### Error Handling

- **Graceful Shutdown**: Handle SIGINT and SIGTERM signals
- **Uncaught Exceptions**: Log and exit gracefully
- **Command Errors**: Provide helpful error messages
- **Validation**: Validate inputs before processing

## Contributing

1. Follow the existing code style and patterns
2. Add proper TypeScript types for all functions
3. Include JSDoc comments for public APIs
4. Test your changes thoroughly
5. Update documentation as needed
6. Follow the monorepo's code quality standards

## License

MIT License - see LICENSE file for details.
