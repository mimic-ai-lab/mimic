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
    DATABASE_URL: z.string().url(),

    // Server Configuration
    API_SERVER_PORT: z.string().transform(Number).default(3001),
    NODE_ENV: z.string().default('development'),
    LOG_LEVEL: z.string().default('info'),

    // Sentry
    SENTRY_DSN: z.string().optional(),

    // Clerk Authentication
    CLERK_PUBLISHABLE_KEY: z.string(),
    CLERK_SECRET_KEY: z.string(),

    // Clerk Webhooks
    CLERK_WEBHOOK_SECRET: z.string(),
});

export type EnvConfig = z.infer<typeof envSchema>; 