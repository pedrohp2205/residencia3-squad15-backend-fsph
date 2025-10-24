import { FastifyInstance } from "fastify";

import { authenticate } from "./authenticate";
import { refresh } from "./refresh";

export async function authRoutes(app: FastifyInstance) {
  app.post(
    "/sessions",
    {
      schema: {
        tags: ["Auth"],
        summary: "Autenticação de usuário",
        description: "Autentica um usuário e retorna tokens JWT (access e refresh).",
        body: {
          type: "object",
          required: ["email", "password"],
          additionalProperties: false,
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
        },
        response: {
          200: {
            description: "Login realizado com sucesso",
            type: "object",
            additionalProperties: false,
            properties: {
              token: { type: "string" },
              refreshToken: { type: "string" },
            },
            required: ["token", "refreshToken"],
          },
          400: {
            description: "Credenciais inválidas",
            type: "object",
            additionalProperties: false,
            properties: {
              message: { type: "string" },
            },
            required: ["message"],
          },
        },
      },
    },
    authenticate
  );

  app.patch(
    "/token/refresh",
    {
      schema: {
        tags: ["Auth"],
        summary: "Renovação de token JWT",
        description:
          "Gera um novo token JWT usando o refresh token armazenado em cookie.",
        // Se quiser documentar cookies no OpenAPI, faça via 'headers' (string 'cookie') ou configure transform no @fastify/swagger.
        response: {
          200: {
            description: "Token renovado com sucesso",
            type: "object",
            additionalProperties: false,
            properties: {
              token: { type: "string" },
            },
            required: ["token"],
          },
          401: {
            description: "Refresh token inválido ou ausente",
            type: "object",
            additionalProperties: false,
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
            required: ["statusCode", "error", "message"],
          },
        },
      },
    },
    refresh
  );
}
