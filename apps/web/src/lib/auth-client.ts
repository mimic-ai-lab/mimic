import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

/**
 * Better Auth client for Next.js frontend.
 * 
 * This client communicates with the Fastify backend API routes
 * and provides reactive authentication state management.
 */
export const authClient = createAuthClient({
    // Point to our Fastify API routes
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",

    // Configure the auth endpoint path
    authPath: "/api/auth",

    // Configure fetch options for proper cookie handling
    fetch: {
        credentials: "include", // Important for cookies
        headers: {
            "Content-Type": "application/json",
        },
    },

    // Add magic link client plugin
    plugins: [
        magicLinkClient()
    ],

    // Debug logging
    logger: {
        disabled: false,
        level: 'debug',
        log: (level: any, message: any, ...args: any[]) => {
            console.log(`[Better Auth Client ${level.toUpperCase()}] ${message}`, ...args);
        },
    },
});

// Export types for better TypeScript support
export type AuthClient = typeof authClient;
export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;

// Export the client for direct use
export { authClient as auth }; 