import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env.js";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Conexão API",
      version: "1.0.0",
      description: "Documentação da API da plataforma Conexão.",
    },
    servers: [
      {
        url: `${env.API_URL}/api`,
        description: "Servidor da API",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/docs/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
