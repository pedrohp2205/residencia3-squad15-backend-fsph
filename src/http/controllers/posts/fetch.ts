import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeLikePostUseCase } from "@/use-cases/factories/make-like-post-use-case";
import { PostNotFoundError } from "@/use-cases/errors/post-not-found-error";
import { makeFetchPostsUseCase } from "@/use-cases/factories/make-fetch-posts-use-case";

export async function fetchPosts(request: FastifyRequest, reply: FastifyReply) {
  try {
    const fetchPostsUseCase = makeFetchPostsUseCase();

    const posts = await fetchPostsUseCase.execute();

    return reply.status(200).send(posts);
  } catch (err) {
    if (err instanceof PostNotFoundError) {
      return reply.status(404).send({ message: err.message });
    } else {
      console.log(err);
      return reply.status(500).send({ message: "Internal server error." });
    }
  }
}
