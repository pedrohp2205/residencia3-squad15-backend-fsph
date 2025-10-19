import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetAvailableCitiesUseCase } from "@/use-cases/factories/make-get-available-cities-use-case";
import { makeGetDonorProfileUseCase } from "@/use-cases/factories/make-get-donor-profile-use-case";
import { makeGetDonorAppointmentsUseCase } from "@/use-cases/factories/make-get-donor-appointments-use-case";
import { app } from "@/app";
import { UserNotFoundError } from "@/use-cases/errors/user-not-found-error";

export async function GetDonorAppointments(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {
    const donorId = request.user.sub;

    const getDonorAppointmentsUseCase = makeGetDonorAppointmentsUseCase();

    const { appointments } = await getDonorAppointmentsUseCase.execute({
      userId: donorId,
    });


    return reply.status(200).send({ appointments });
  } catch (err) {
    console.log(err);
    return reply.status(500).send({ message: "Internal server error." });
  }
}


