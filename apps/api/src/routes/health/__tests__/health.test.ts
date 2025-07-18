/**
 * Health endpoint tests.
 *
 * Tests the /health endpoint functionality and response format.
 */
import request from 'supertest';
import { FastifyInstance } from 'fastify';
//@ts-ignore
import { createTestServerWithRoutes } from '@/utils/test/helpers';

// Import the actual health route handler
import HealthRoutes from '../index';

describe('Health Routes', () => {
    let app: FastifyInstance;

    beforeAll(async () => {
        app = await createTestServerWithRoutes(async (fastify) => {
            // Register the actual health routes
            await fastify.register(HealthRoutes);
        });
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /health', () => {
        it('should return 200 with status ok', async () => {
            const response = await request(app.server)
                .get('/health')
                .expect(200);

            expect(response.body).toEqual({ status: 'ok' });
        });

        it('should have correct content type', async () => {
            const response = await request(app.server)
                .get('/health')
                .expect('Content-Type', /json/);
        });
    });
}); 