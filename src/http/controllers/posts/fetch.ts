import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeLikePostUseCase } from "@/use-cases/factories/make-like-post-use-case";
import { PostNotFoundError } from "@/use-cases/errors/post-not-found-error";
import { makeFetchPostsUseCase } from "@/use-cases/factories/make-fetch-posts-use-case";

export async function fetchPosts(request: FastifyRequest, reply: FastifyReply) {
  try {
    const fetchPostsQuerySchema = z.object({
      take: z
        .string()
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val > 0 && val <= 100, {
          message: "take must be a number between 1 and 100",
        })
        .optional(),
      cursor: z.uuid().optional(),
    });

    const { take, cursor } = fetchPostsQuerySchema.parse(request.query);

    const fetchPostsUseCase = makeFetchPostsUseCase();

    const posts = await fetchPostsUseCase.execute({
      currentUserId: request.user.sub,
      take: take,
      cursor: cursor,
    });

    return reply.status(200).send(posts);
  } catch (err) {
    if (err instanceof PostNotFoundError) {
      return reply.status(200).send([]);
    } else {
      // console.log(err);
      return reply.status(500).send({ message: "Internal server error." });
    }
  }
}
