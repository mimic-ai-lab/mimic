/**
 * Better Auth configuration for the Mimic API server.
 *
 * Sets up authentication with magic link support using the modular
 * database and email services. Provides a properly typed auth instance
 * for use throughout the application.
 */
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { getDatabase } from "./database";
import { sendMagicLinkEmail } from "./email";

// Create Better Auth instance with proper typing
const auth = betterAuth({
    database: {
        db: getDatabase(),
        type: 'postgres',
    },
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        magicLink({
            sendMagicLink: async ({ email, url, token }, request) => {
                await sendMagicLinkEmail(email, url);
            },
            expiresIn: 300, // 5 minutes
        }),
    ],
    secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-cli",
    baseUrl: process.env.BETTER_AUTH_URL || "http://localhost:4000",
    trustedOrigins: ["http://localhost:3000", "https://mimicai.co"],
});

export { auth }; 