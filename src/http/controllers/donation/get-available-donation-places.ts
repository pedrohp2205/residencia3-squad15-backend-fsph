import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetAvailableDonationPlacesUseCase } from "@/use-cases/factories/make-get-available-donation-places-use-case";

export async function GetAvailableDonationPlaces(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getAvailableDonationPlacesParamsSchema = z.object({
    appointmentType: z.enum(["D", "M", "C"]),
    cityId: z.string().transform((value) => BigInt(value)),
  });

  const { appointmentType, cityId } = getAvailableDonationPlacesParamsSchema.parse(
    request.query
  );

  try {
    const getAvailableDonationPlacesUseCase = makeGetAvailableDonationPlacesUseCase();

    const { places } = await getAvailableDonationPlacesUseCase.execute({
      appointmentType,
      cityId,
    });

    return reply.status(200).send({ places });
  } catch (err) {
    console.log(err);
    return reply.status(500).send({ message: "Internal server error." });
  }
}
