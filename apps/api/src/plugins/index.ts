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
    await fastify.register(envPlugin);

    // Enable CORS for all origins and common HTTP methods
    fastify.register(cors, {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        credentials: false,
    });
    // Register additional plugins here as needed
}