import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetAvailableCitiesUseCase } from "@/use-cases/factories/make-get-available-cities-use-case";

export async function GetAvailableCities(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getAvailableCitiesParamsSchema = z.object({
    appointmentType: z.enum(["D", "M", "C"]),
  });

  const { appointmentType } = getAvailableCitiesParamsSchema.parse(
    request.query
  );

  try {
    const getAvailableCitiesUseCase = makeGetAvailableCitiesUseCase();

    const { cities } = await getAvailableCitiesUseCase.execute({
      appointmentType,
    });

    return reply.status(200).send({ cities });
  } catch (err) {
    console.log(err);
    return reply.status(500).send({ message: "Internal server error." });
  }
}
