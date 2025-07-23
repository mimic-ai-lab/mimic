import { Command } from 'commander';
import { readFileSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';
import chalk from 'chalk';
import yaml from 'js-yaml';
import { logger } from '../utils/logger';

// Agent YAML validation schema
const AgentYamlSchema = z.object({
    name: z.string().min(1, "Agent name is required").max(255, "Agent name too long"),
    id: z.string().uuid("Agent ID must be a valid UUID").optional(),
    version: z.string().optional(),
    description: z.string().min(1, "Description is required").max(1000, "Description too long"),
    agent_type: z.enum(["chat", "voice"]),
    platform: z.string().min(1, "Platform is required").max(100, "Platform name too long"),
    platform_config: z.record(z.string(), z.any()).default({})
});

// Platform-specific validation schemas
const WhatsAppConfigSchema = z.object({
    webhook_url: z.string().url("Webhook URL must be a valid URL"),
    display_phone_number: z.string().regex(/^\+[1-9]\d{1,14}$/, "Phone number must be in international format (e.g., +1234567890)"),
    phone_number_id: z.string().min(1, "Phone number ID is required"),
    graph_api_version: z.string().regex(/^v\d+\.\d+$/, "Graph API version must be in format vXX.X (e.g., v23.0)")
});

// Valid platforms for each agent type
const VALID_PLATFORMS = {
    chat: ["whatsapp", "slack", "teams", "sms", "email", "websocket"],
    voice: ["twilio", "custom", "phone"]
} as const;

type AgentType = keyof typeof VALID_PLATFORMS;
type Platform = typeof VALID_PLATFORMS[AgentType][number];

// Platform config validation functions
const platformConfigValidators: Record<string, (config: any) => { valid: boolean; errors: any[] }> = {
    whatsapp: (config: any) => {
        const result = WhatsAppConfigSchema.safeParse(config);
        if (!result.success) {
            return { valid: false, errors: result.error.issues };
        }
        return { valid: true, errors: [] };
    },
    slack: (config: any) => {
        // Basic Slack validation - can be expanded
        if (!config.slackToken && !config.webhookUrl) {
            return {
                valid: false,
                errors: [{ message: "Slack config must include either slackToken or webhookUrl" }]
            };
        }
        return { valid: true, errors: [] };
    },
    teams: (config: any) => {
        // Basic Teams validation - can be expanded
        if (!config.teamsWebhook) {
            return {
                valid: false,
                errors: [{ message: "Teams config must include teamsWebhook" }]
            };
        }
        return { valid: true, errors: [] };
    }
};

/**
 * Validate agent YAML configuration
 */
async function validateAgentYaml(filePath: string): Promise<{ valid: boolean; errors: any[]; warnings: string[] }> {
    const errors: any[] = [];
    const warnings: string[] = [];

    try {
        // Read and parse YAML file
        const fileContent = readFileSync(filePath, 'utf8');
        const agentConfig = yaml.load(fileContent);

        // Validate basic schema
        const schemaResult = AgentYamlSchema.safeParse(agentConfig);
        if (!schemaResult.success) {
            errors.push(...schemaResult.error.issues);
        } else {
            const config = schemaResult.data;

            // Validate platform compatibility
            const validPlatforms = VALID_PLATFORMS[config.agent_type];
            const isValidPlatform = (validPlatforms as readonly string[]).includes(config.platform);
            if (!isValidPlatform) {
                errors.push({
                    message: `Platform '${config.platform}' is not valid for agent type '${config.agent_type}'. Valid platforms: ${validPlatforms.join(', ')}`
                });
            }

            // Validate platform-specific configuration
            const platformValidator = platformConfigValidators[config.platform];
            if (platformValidator) {
                const platformResult = platformValidator(config.platform_config);
                if (!platformResult.valid) {
                    errors.push(...platformResult.errors);
                }
            }

            // Version validation
            if (config.id && !config.version) {
                warnings.push("Agent ID provided but no version specified. Version will be auto-generated.");
            }

            // Check for required fields
            if (!config.platform_config || Object.keys(config.platform_config).length === 0) {
                warnings.push("Platform configuration is empty. Agent may not function properly.");
            }
        }

    } catch (error: any) {
        if (error.code === 'ENOENT') {
            errors.push({ message: `File not found: ${filePath}` });
        } else if (error.name === 'YAMLException') {
            errors.push({ message: `Invalid YAML format: ${error.message}` });
        } else {
            errors.push({ message: `Error reading file: ${error.message}` });
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Agent validation command
 */
export function agentCommand(program: Command): void {
    const agentGroup = program
        .command('agent')
        .description('Agent management commands');

    agentGroup
        .command('validate')
        .description('Validate agent YAML configuration')
        .argument('<file>', 'Path to agent.yaml file')
        .option('-v, --verbose', 'Show detailed validation information')
        .action(async (file: string, options: { verbose: boolean }) => {
            try {
                logger.info(`Validating agent configuration: ${file}`);

                const result = await validateAgentYaml(file);

                if (result.valid) {
                    logger.success('✅ Agent configuration is valid!');

                    if (result.warnings.length > 0) {
                        logger.warn('⚠️  Warnings:');
                        result.warnings.forEach(warning => {
                            logger.warn(`   ${warning}`);
                        });
                    }

                    if (options.verbose) {
                        logger.info('📋 Validation Summary:');
                        logger.info('   - Basic schema: ✅ Valid');
                        logger.info('   - Platform compatibility: ✅ Valid');
                        logger.info('   - Platform configuration: ✅ Valid');
                    }
                } else {
                    logger.error('❌ Agent configuration is invalid!');

                    logger.error('Errors:');
                    result.errors.forEach((error, index) => {
                        logger.error(`   ${index + 1}. ${error.message}`);
                    });

                    if (result.warnings.length > 0) {
                        logger.warn('⚠️  Warnings:');
                        result.warnings.forEach(warning => {
                            logger.warn(`   ${warning}`);
                        });
                    }

                    process.exit(1);
                }

            } catch (error: any) {
                logger.error('Validation failed:', error.message);
                process.exit(1);
            }
        });

    // Add more agent commands here in the future
    // agentGroup.command('deploy')...
    // agentGroup.command('update')...
    // agentGroup.command('list')...
} 