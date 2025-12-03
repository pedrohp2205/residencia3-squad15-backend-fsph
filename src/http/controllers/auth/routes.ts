import { FastifyInstance } from "fastify";

import { authenticate } from "./authenticate";
import { refresh } from "./refresh";
import { googleIdController } from "./google-id";

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
          additionalProperties: true,
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
        },
        response: {
          200: {
            description: "Login realizado com sucesso",
            type: "object",
            additionalProperties: true,
            properties: {
              token: { type: "string" },
              refreshToken: { type: "string" },
            },
            required: ["token", "refreshToken"],
          },
          400: {
            description: "Credenciais inválidas",
            type: "object",
            additionalProperties: true,
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
        response: {
          200: {
            description: "Token renovado com sucesso",
            type: "object",
            additionalProperties: true,
            properties: {
              token: { type: "string" },
            },
            required: ["token"],
          },
          401: {
            description: "Refresh token inválido ou ausente",
            type: "object",
            additionalProperties: true,
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

    app.post(
    "/auth/google/id",
    {
      schema: {
        tags: ["Auth"],
        summary: "Autenticação com Google (ID Token)",
        description:
          "Recebe um ID Token do Google, valida e retorna tokens JWT. Também define o refreshToken em cookie (httpOnly, sameSite, secure).",
        body: {
          type: "object",
          required: ["idToken"],
          additionalProperties: true,
          properties: {
            idToken: { type: "string", minLength: 20 },
          },
        },
        response: {
          200: {
            type: "object",
            additionalProperties: true,
            properties: {
              token: { type: "string" },
              refreshToken: { type: "string" },
            },
            required: ["token", "refreshToken"],
          },
          403: {
            description: "Email do Google não verificado",
            type: "object",
            additionalProperties: true,
            properties: {
              message: { type: "string" },
            },
            required: ["message"],
          },
          400: {
            description: "Erro de validação do corpo (Zod)",
            type: "object",
            additionalProperties: true,
            properties: {
              message: { type: "string" },
            },
            required: ["message"],
          },
          500: {
            description: "Erro interno",
            type: "object",
            additionalProperties: true,
            properties: {
              message: { type: "string" },
            },
            required: ["message"],
          },
        },
      },
    },
    googleIdController
  );
}
