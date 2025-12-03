import { FastifyInstance } from "fastify";
import { createPost } from "./create";
import { verifyJwt } from "../../middlewares/verify-jwt";
import { likePost } from "./like";
import { fetchPosts } from "./fetch";
import { commentPost } from "./comment";

export async function postsRoutes(app: FastifyInstance) {
  // POST /posts (multipart)
  app.post(
    "/posts",
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ["Posts"],
        summary: "Criar post",
        description:
          "Cria um post com texto (até 280 caracteres) e exatamente 1 imagem (PNG ou JPEG). Envie via multipart/form-data.",
        response: {
          201: {
            type: "object",
            additionalProperties: true, // o handler pode retornar { ok: true } ou um objeto do use-case
          },
          400: {
            type: "object",
            additionalProperties: true,
            properties: { message: { type: "string" } },
            required: ["message"],
          },
          404: {
            type: "object",
            additionalProperties: true,
            properties: { message: { type: "string" } },
            required: ["message"],
          },
          500: {
            type: "object",
            additionalProperties: true,
            properties: { message: { type: "string" } },
            required: ["message"],
          },
        },
      },
    },
    createPost
  );

  // POST /posts/like
  app.post(
    "/posts/like",
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ["Posts"],
        summary: "Curtir post",
        description: "Marca 'like' em um post.",
        querystring: {
          type: "object",
          required: ["postId"],
          additionalProperties: true,
          properties: {
            postId: { type: "string", format: "uuid" },
          },
        },
        response: {
          201: { type: "null", nullable: true },
          404: {
            type: "object",
            additionalProperties: true,
            properties: { message: { type: "string" } },
            required: ["message"],
          },
          500: {
            type: "object",
            additionalProperties: true,
            properties: { message: { type: "string" } },
            required: ["message"],
          },
        },
      },
    },
    likePost
  );

  // GET /posts
  app.get(
    "/posts",
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ["Posts"],
        summary: "Listar posts",
        description:
          "Lista posts com paginação baseada em cursor. `take` deve ser um número entre 1 e 100 (enviado como string).",
        querystring: {
          type: "object",
          additionalProperties: true,
          properties: {
            take: { type: "string", pattern: "^[0-9]+$" },
            cursor: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: {
            // o handler retorna diretamente 'posts' (geralmente um array)
            type: "array",
            items: { type: "object", additionalProperties: true },
          },
          404: {
            type: "object",
            additionalProperties: true,
            properties: { message: { type: "string" } },
            required: ["message"],
          },
          500: {
            type: "object",
            additionalProperties: true,
            properties: { message: { type: "string" } },
            required: ["message"],
          },
        },
      },
    },
    fetchPosts
  );

  // POST /posts/comment
  app.post(
    "/posts/comment",
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ["Posts"],
        summary: "Comentar post",
        description: "Cria um comentário em um post existente.",
        body: {
          type: "object",
          required: ["postId", "content"],
          additionalProperties: true,
          properties: {
            postId: { type: "string", format: "uuid" },
            content: { type: "string", minLength: 1, maxLength: 280 },
          },
        },
        response: {
          201: { type: "null", nullable: true },
          404: {
            type: "object",
            additionalProperties: true,
            properties: { message: { type: "string" } },
            required: ["message"],
          },
          500: {
            type: "object",
            additionalProperties: true,
            properties: { message: { type: "string" } },
            required: ["message"],
          },
        },
      },
    },
    commentPost
  );
}
