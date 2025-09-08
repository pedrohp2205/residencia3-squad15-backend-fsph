import { FastifyInstance } from "fastify";
import { createPost } from "./create";
import { verifyJwt } from "../../middlewares/verify-jwt";

export async function postsRoutes(app: FastifyInstance) {
  app.post("/posts", { onRequest: [verifyJwt] }, createPost);
}
