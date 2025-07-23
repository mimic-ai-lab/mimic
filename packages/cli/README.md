# Mimic CLI

A professional command-line interface for the Mimic agent simulation platform. Built with TypeScript, Commander.js, and Chalk for a modern developer experience.

## Features

- **Agent Management**: Validate, deploy, and manage agent configurations
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

### Agent Management

The CLI provides comprehensive agent management capabilities for validating and deploying agent configurations.

#### Validate Agent Configuration

```bash
# Basic validation
mimic agent validate agent.yaml

# Verbose validation with detailed output
mimic agent validate agent.yaml --verbose

# Show help for agent commands
mimic agent --help
```

**Agent YAML Structure:**

```yaml
# Required fields
name: 'Customer Support Bot'
description: 'AI agent for handling customer inquiries'
agent_type: 'chat' # or "voice"
platform: 'whatsapp' # platform-specific
platform_config:
  # Platform-specific configuration
  webhook_url: 'https://api.mimicai.co/webhooks/whatsapp'
  display_phone_number: '+1234567890'
  phone_number_id: '2331313123213'
  graph_api_version: 'v23.0'

# Optional fields
id: '550e8400-e29b-41d4-a716-446655440000' # UUID for updates
version: '1.0.0' # Auto-generated if not provided
```

**Supported Platforms:**

- **Chat Agents:**
  - `whatsapp` - WhatsApp Business API
  - `slack` - Slack Bot API
  - `teams` - Microsoft Teams
  - `sms` - SMS messaging
  - `email` - Email integration
  - `websocket` - WebSocket connections

- **Voice Agents:**
  - `twilio` - Twilio Voice API
  - `custom` - Custom voice integration
  - `phone` - Traditional phone systems

**Validation Features:**

- ✅ Schema validation (required fields, data types)
- ✅ Platform compatibility checking
- ✅ Platform-specific configuration validation
- ✅ URL format validation
- ✅ Phone number format validation
- ✅ UUID format validation
- ⚠️ Smart warnings for missing optional fields

**Example Validation Output:**

```bash
$ mimic agent validate agent.yaml --verbose
✅ Agent configuration is valid!
📋 Validation Summary:
   - Basic schema: ✅ Valid
   - Platform compatibility: ✅ Valid
   - Platform configuration: ✅ Valid

# With errors:
❌ Agent configuration is invalid!
Errors:
   1. Platform 'invalid_platform' is not valid for agent type 'chat'
   2. Webhook URL must be a valid URL
   3. Phone number must be in international format
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
│   ├── config.ts        # Configuration management
│   └── agent.ts         # Agent management
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

### Agent Validation Architecture

The agent validation system uses a layered approach:

1. **Schema Validation**: Zod schemas for basic structure validation
2. **Platform Compatibility**: Ensures platform matches agent type
3. **Platform-Specific Validation**: Custom validators for each platform
4. **Warning System**: Provides helpful suggestions for optional fields

**Validation Flow:**

```
YAML File → Parse → Schema Validation → Platform Check → Platform Config → Result
```

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
