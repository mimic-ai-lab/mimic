/**
 * Registers the /health endpoint for uptime and monitoring checks.
 *
 * @param {FastifyInstance} fastify - Fastify server instance
 * @returns {Promise<void>}
 */
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

async function HealthRoutes(fastify: FastifyInstance): Promise<void> {
    /**
     * GET /health
     *
     * Returns a simple status object. Used by load balancers and monitoring tools
     * to verify the server is running and responsive.
     */
    fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            reply.send({ status: 'ok' });
        } catch (error) {
            // Log unexpected errors for debugging
            fastify.log.error(error);
            reply.status(500).send({ status: 'error' });
        }
    });
}

export default HealthRoutes;