/**
 * Registers core Fastify plugins.
 *
 * @param {FastifyInstance} fastify - Fastify server instance
 * @returns {Promise<void>}
 */
import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import envPlugin from './env';
import responseStandardizer from './response-standardizer';
import { clerkPlugin } from '@clerk/fastify'


export default async function setupPlugins(fastify: FastifyInstance): Promise<void> {
    // Register environment validation plugin first
    fastify.register(envPlugin);

    // Register response standardizer plugin
    fastify.register(responseStandardizer);

    // Configure CORS policies for Better Auth
    fastify.register(cors, {
        origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With"
        ],
        credentials: true,
        maxAge: 86400
    });

    fastify.register(clerkPlugin)


    // Register additional plugins here as needed
}