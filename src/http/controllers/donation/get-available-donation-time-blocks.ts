import { makeGetAvailableDonationTimeBlocksUseCase } from "@/use-cases/factories/make-get-available-donation-time-blocks";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function GetAvailableDonationTimeBlocks(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getAvailableDonationTimeBlocksParamsSchema = z.object({
    appointmentType: z.enum(["D", "M", "C"]),
    selectedDate: z
    .string()
    .optional()
    .transform((date) => (date ? new Date(date) : undefined)),
    placeId: z.string().transform((id) => BigInt(id)),
  });

  const { appointmentType, selectedDate, placeId } = getAvailableDonationTimeBlocksParamsSchema.parse(
    request.query
  );

  try {
    const getAvailableDonationTimeBlocksUseCase = makeGetAvailableDonationTimeBlocksUseCase();

    const { timeBlocks } = await getAvailableDonationTimeBlocksUseCase.execute({
      appointmentType,
      placeId: placeId,
      selectedDate,
    });

    return reply.status(200).send({ timeBlocks });
  } catch (err) {
    console.log(err);
    return reply.status(500).send({ message: "Internal server error." });
  }
}
