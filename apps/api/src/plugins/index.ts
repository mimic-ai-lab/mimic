/**
 * Registers core Fastify plugins.
 *
 * @param {FastifyInstance} fastify - Fastify server instance
 * @returns {Promise<void>}
 */
import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import envPlugin from './env';

export default async function setupPlugins(fastify: FastifyInstance): Promise<void> {
    // Register environment validation plugin first
    // await fastify.register(envPlugin);

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

    // Register additional plugins here as needed
}