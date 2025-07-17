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

    // Better Auth
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string().url().default('http://localhost:4000'),

    // Resend (Email Service)
    RESEND_API_KEY: z.string(),
    RESEND_FROM_EMAIL: z.string().email().default('noreply@mimic.dev'),
});

export type EnvConfig = z.infer<typeof envSchema>; 