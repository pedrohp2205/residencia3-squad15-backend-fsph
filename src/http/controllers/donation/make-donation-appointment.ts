import { ProfileNotCompletedError } from "@/use-cases/errors/profile-not-completed-error";
import { makeMakeDonationAppointmentUseCase } from "@/use-cases/factories/make-donation-appointment-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function MakeDonationAppointment(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {

    const makeDonationAppointmentBodySchema = z.object({
      appointmentType: z.enum(["D", "M"]),
      timeBlockId: z.string().transform((id) => BigInt(id)),
      firstTimeDonating: z.boolean(),
      weightMoreThanFiftyKg: z.boolean(),
      wasTatooedInPlaceNotCertified: z.boolean(),
    })

    const { appointmentType, timeBlockId, firstTimeDonating, weightMoreThanFiftyKg, wasTatooedInPlaceNotCertified } = makeDonationAppointmentBodySchema.parse(request.body);


    const donorId = request.user.sub;

    const makeDonationAppointmentUseCase = makeMakeDonationAppointmentUseCase();

    await makeDonationAppointmentUseCase.execute({
      userId: donorId,
      appointmentType,
      timeBlockId,
      firstTimeDonating,
      weightMoreThanFiftyKg,
      wasTatooedInPlaceNotCertified,
    });


    return reply.status(201).send();
  } catch (err) {
    console.log(err)
    if (err instanceof ProfileNotCompletedError) {
      return reply.status(400).send({ message: "Seu perfil deve estar completo para continuar."});
    }
    return reply.status(500).send({ message: "Internal server error." });
  }
}


