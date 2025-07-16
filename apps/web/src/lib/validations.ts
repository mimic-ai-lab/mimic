import { z } from 'zod';

export const signupSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

    organisation: z
        .string()
        .min(2, 'Organisation must be at least 2 characters')
        .max(100, 'Organisation must be less than 100 characters'),

    email: z
        .string()
        .email('Please enter a valid email address')
        .min(1, 'Email is required'),
});

export const loginSchema = z.object({
    email: z
        .string()
        .email('Please enter a valid email address')
        .min(1, 'Email is required'),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>; 