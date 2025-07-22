/**
 * Clerk webhook schema definitions.
 *
 * Defines Zod schemas for webhook event validation and type safety.
 */
import { z } from 'zod';

// Schema for user creation and update events
export const UserCreatedSchema = z.object({
    id: z.string(),
    email_addresses: z.array(z.object({
        email_address: z.string().email().optional(),
        id: z.string().optional(),
        verification: z.object({
            status: z.string().optional(),
            strategy: z.string().optional(),
        }).optional(),
    })).optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    username: z.string().nullable().optional(),
    image_url: z.string().optional(),
    created_at: z.number().optional(),
    updated_at: z.number().optional(),
}).passthrough();

// Schema for user deletion events (different structure)
export const UserDeletedSchema = z.object({
    id: z.string(),
    deleted: z.boolean().optional(),
    object: z.literal('user').optional(),
}).passthrough();

export const WebhookEventSchema = z.object({
    data: z.union([UserCreatedSchema, UserDeletedSchema]),
    object: z.literal('event'),
    type: z.string(),
    timestamp: z.number(),
    instance_id: z.string(),
}).passthrough();

export type UserCreatedSchemaType = z.infer<typeof UserCreatedSchema>;
export type UserDeletedSchemaType = z.infer<typeof UserDeletedSchema>;
export type WebhookEventSchemaType = z.infer<typeof WebhookEventSchema>; 