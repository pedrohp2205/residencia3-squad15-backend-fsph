import { FastifyReply, FastifyRequest } from "fastify";
import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile-use-case";

export async function getUserProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const useCase = makeGetUserProfileUseCase();

  const result = await useCase.execute({ userId: request.user.sub });

  const { profile } = result; 


  return reply.status(200).send({ profile});
}
