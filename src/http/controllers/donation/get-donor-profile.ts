import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetDonorProfileUseCase } from "@/use-cases/factories/make-get-donor-profile-use-case";

export async function GetDonorProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {


  try {

    const donorId = request.user.sub;
    
    const getDonorProfileUseCase = makeGetDonorProfileUseCase();

    const { profile } = await getDonorProfileUseCase.execute({
      userId: donorId,
    });

    return reply.status(200).send({ profile });
  } catch (err) {
    console.log(err);
    return reply.status(500).send({ message: "Internal server error." });
  }
}


