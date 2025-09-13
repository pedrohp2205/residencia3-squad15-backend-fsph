import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PostNotFoundError } from "@/use-cases/errors/post-not-found-error";
import { makeCommentPostUseCase } from "@/use-cases/factories/make-comment-post-use-case";

export async function commentPost(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const commentPostBodySchema = z.object({
    postId: z.uuid(),
    content: z.string().min(1).max(280),
  });

  const { postId, content } = commentPostBodySchema.parse(request.body);

  try {
    const commentPostUseCase = makeCommentPostUseCase();

    await commentPostUseCase.execute({
      postId,
      userId: request.user.sub,
      content,
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
