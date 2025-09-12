import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeLikePostUseCase } from "@/use-cases/factories/make-like-post-use-case";
import { PostNotFoundError } from "@/use-cases/errors/post-not-found-error";
import { UserAlreadyLikedPostError } from "@/use-cases/errors/user-already-liked-post";

export async function likePost(request: FastifyRequest, reply: FastifyReply) {
  const likePostBodySchema = z.object({
    postId: z.uuid(),
  });

  const { postId } = likePostBodySchema.parse(request.query);

  try {
    const likePostUseCase = makeLikePostUseCase();

    await likePostUseCase.execute({
      postId,
      userId: request.user.sub,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof PostNotFoundError) {
      return reply.status(404).send({ message: err.message });
    } else {
      console.log(err);
      return reply.status(500).send({ message: "Internal server error." });
    }
  }
}
