import type { FastifyInstance, FastifyPluginAsync, FastifyRequest } from "fastify";
import * as color from "kolorist";
import type pino from "pino";
import fp from "fastify-plugin";
import { v4 as uuidv4 } from "uuid";

declare module 'fastify' {
    interface FastifyRequest {
        reqID: string;
    }
}

export type FastifyRequestLoggerOptions = {
    logBody?: boolean; // Whether to log request bodies
    logResponseTime?: boolean; // Whether to log response times
    logBindings?: Record<string, unknown>; // Custom bindings to include in logs
    ignoredPaths?: Array<string | RegExp>; // Paths to ignore from logging
    ignoredBindings?: Record<string, unknown>; // Bindings for ignored paths
    ignore?: (request: FastifyRequest) => boolean; // Custom ignore function
};

const loggerPlugin: FastifyPluginAsync<FastifyRequestLoggerOptions> = async (
    fastify: FastifyInstance,
    options = {}
): Promise<void> => {
    const supportsArt = color.options.supportLevel >= 2; /* SupportLevel.ansi256 */
    const icons = { req: supportsArt ? "←" : "<", res: supportsArt ? "→" : ">" };

    // Destructure and set default options
    const {
        logBody = true,
        logResponseTime = true,
        logBindings = {},
        ignoredPaths = [],
        ignoredBindings,
        ignore,
    } = options;

    // Check if a request should be ignored based on path or custom logic
    const isIgnoredRequest = (request: FastifyRequest): boolean => {
        const { url } = request.routeOptions;
        const isIgnoredPath = ignoredPaths.some((ignoredPath) => {
            if (typeof ignoredPath === "string") {
                return ignoredPath === url;
            } else if (ignoredPath instanceof RegExp) {
                return ignoredPath.test(url!);
            }
            return false;
        });

        return isIgnoredPath || (ignore ? ignore(request) : false);
    };

    fastify.addHook("onRequest", async (request) => {
        request.reqID = uuidv4();
        if (isIgnoredRequest(request)) {
            if (ignoredBindings) {
                (request.log as pino.Logger).setBindings(ignoredBindings);
            }
            return;
        }
        const contentLength = request.headers["content-length"];
        request.log.info(
            logBindings,
            `${color.bold(color.yellow(icons.req))} ${color.yellow(request.method)} ${color.green(request.url)} ${color.blue(request.ip)}${contentLength ? ` (${color.yellow(contentLength)}b)` : ""}`,
        );
        request.log.trace({ ...logBindings, req: request }, `Request trace`);
    });

    fastify.addHook("preHandler", async (request) => {
        if (isIgnoredRequest(request)) {
            return;
        }
        if (request.body && logBody) {
            if (Buffer.isBuffer(request.body)) {
                request.log.debug({ ...logBindings, body: `<Buffer ${request.body.length} bytes>` }, `Request body`);
            } else {
                request.log.debug({ ...logBindings, body: request.body }, `📦 Request body`);
            }
        }
    });

    fastify.addHook("onResponse", async (request, reply) => {
        if (isIgnoredRequest(request)) {
            return;
        }
        request.log.info(
            logBindings,
            `${color.bold(color.yellow(icons.res))} ${color.yellow(request.method)} ${color.green(request.url)} ${color.magenta(reply.statusCode)}${logResponseTime ? ` ${color.magenta(reply.elapsedTime.toFixed(3))}ms` : ""}`,
        );
    });
};

export default fp(loggerPlugin); 