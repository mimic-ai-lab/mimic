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
    // Basic configuration
    appName: "Mimic AI Lab",
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
    basePath: "/api/auth",
    trustedOrigins: ["http://localhost:3000", "https://mimicai.co"],
    secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-cli",

    // Database configuration
    database: {
        db: getDatabase(),
        type: 'postgres',
        dialect: 'postgres',
        casing: 'camel'
    },

    // Session configuration
    session: {
        modelName: "sessions",
        expiresIn: 604800, // 7 days
        updateAge: 86400, // 1 day
        disableSessionRefresh: false,
        storeSessionInDatabase: true,
        preserveSessionInDatabase: false
    },

    // User configuration
    user: {
        modelName: "users",
        fields: {
            email: "email",
            name: "name"
        },
        changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async ({ user, newEmail, url, token }) => {
                await sendMagicLinkEmail(newEmail, url);
            }
        },
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url, token }) => {
                await sendMagicLinkEmail(user.email, url);
            }
        }
    },

    // OAuth providers
    // oauth: {
    //     github: {
    //         clientId: process.env.GITHUB_CLIENT_ID || "",
    //         clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    //         scope: ["user:email"],
    //     },
    //     google: {
    //         clientId: process.env.GOOGLE_CLIENT_ID || "",
    //         clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    //         scope: ["openid", "email", "profile"],
    //     },
    // },

    // Rate limiting
    rateLimit: {
        enabled: true,
        window: 60, // 1 minute
        max: 10, // 10 requests per minute for auth endpoints
        customRules: {
            "/api/auth/sign-in/email": {
                window: 300, // 5 minutes
                max: 5 // 5 magic link requests per 5 minutes
            },
            "/api/auth/sign-up/email": {
                window: 300, // 5 minutes
                max: 3 // 3 signup requests per 5 minutes
            }
        },
        storage: "database",
        modelName: "rateLimit"
    },

    // Security and advanced settings
    advanced: {
        ipAddress: {
            ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
            disableIpTracking: false
        },
        useSecureCookies: process.env.NODE_ENV === 'production',
        disableCSRFCheck: false,
        cookies: {
            session_token: {
                name: "mimic_session",
                attributes: {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: "lax",
                    domain: process.env.NODE_ENV === 'production' ? '.mimicai.co' : 'localhost'
                }
            }
        },
        defaultCookieAttributes: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            domain: process.env.NODE_ENV === 'production' ? '.mimicai.co' : 'localhost'
        },

        database: {
            useNumberId: false,
            defaultFindManyLimit: 100,
        }
    },

    // Logging
    logger: {
        disabled: false,
        level: process.env.NODE_ENV === 'production' ? 'error' : 'info',
        log: (level, message, ...args) => {
            console.log(`[Better Auth ${level.toUpperCase()}] ${message}`, ...args);
        }
    },

    // Error handling
    onAPIError: {
        throw: false,
        onError: (error, ctx) => {
            console.error("Better Auth API Error:", error);
        },
        errorURL: "/auth/error"
    },



    // Magic link plugin
    plugins: [
        magicLink({
            sendMagicLink: async ({ email, url, token }, request) => {
                // Generate frontend URL for magic link verification
                const frontendUrl = `${process.env.CLIENT_ORIGIN || "http://localhost:3000"}/verify?token=${token}`;
                await sendMagicLinkEmail(email, frontendUrl);
            },
            expiresIn: 300, // 5 minutes
        }),
    ],
});

export { auth }; 