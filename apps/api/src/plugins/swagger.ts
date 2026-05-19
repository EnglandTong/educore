import type { FastifyPluginAsync } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export const swaggerPlugin: FastifyPluginAsync = async (app) => {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "EduCore API",
        version: "1.0.0"
      },
      openapi: "3.1.0"
    }
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs"
  });
};
