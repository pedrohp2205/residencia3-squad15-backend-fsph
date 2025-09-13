import { FastifyInstance } from "fastify";
import { createPost } from "./create";
import { verifyJwt } from "../../middlewares/verify-jwt";
import { likePost } from "./like";
import { fetchPosts } from "./fetch";
import { commentPost } from "./comment";

export async function postsRoutes(app: FastifyInstance) {
  app.post("/posts", { onRequest: [verifyJwt] }, createPost);
  app.post("/posts/like", { onRequest: [verifyJwt] }, likePost);
  app.get("/posts", { onRequest: [verifyJwt] }, fetchPosts);
  app.post("/posts/comment", { onRequest: [verifyJwt] }, commentPost);
}
