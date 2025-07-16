/**
 * Environment configuration types for the Mimic API server.
 *
 * Defines the schema and types for environment variables used throughout
 * the application.
 */
import { z } from 'zod';

// Environment configuration schema
export const envSchema = z.object({
    // Database
    DATABASE_URL: z.string().url().optional(),

    // Redis
    REDIS_URL: z.string().url().optional(),

    // Server Configuration
    PORT: z.string().transform(Number).default(4000),
    NODE_ENV: z.string().default('development'),
    LOG_LEVEL: z.string().default('info'),

    // Sentry
    SENTRY_DSN: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>; 