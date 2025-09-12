import { FastifyInstance } from "fastify";
import { createPost } from "./create";
import { verifyJwt } from "../../middlewares/verify-jwt";
import { likePost } from "./like";

export async function postsRoutes(app: FastifyInstance) {
  app.post("/posts", { onRequest: [verifyJwt] }, createPost);
  app.post("/posts/like", { onRequest: [verifyJwt] }, likePost);
}
