import { makeMakeDonationCampaignAppointmentUseCase } from "@/use-cases/factories/make-donation-campaign-appointment-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { UserNotFoundError } from "@/use-cases/errors/user-not-found-error";
import { ProfileNotCompletedError } from "@/use-cases/errors/profile-not-completed-error";

export async function MakeCampaignDonationAppointment(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const makeCampaignDonationAppointmentBodySchema = z.object({
      shift: z.enum(["morning", "afternoon"]),
      date: z
        .coerce
        .date()
        .refine((d) => d > new Date(), {
          message: "A data deve ser futura.",
        }),
      amountOfDonors: z.coerce.number().int().min(1),
    });

    const { shift, date, amountOfDonors } =
      makeCampaignDonationAppointmentBodySchema.parse(request.body);

    const userId = request.user.sub;

    const makeCampaignDonationAppointmentUseCase =
      makeMakeDonationCampaignAppointmentUseCase();

    const { appointment } =
      await makeCampaignDonationAppointmentUseCase.execute({
        userId,
        shift,
        date,
        amountOfDonors,
      });

    return reply.status(201).send({ appointment });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return reply.status(400).send({
        message: "Erro de validação",
        issues: err.errors,
      });
    }

    // Regras de negócio do use case
    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({ message: "Usuário não encontrado." });
    }
    if (err instanceof ProfileNotCompletedError) {
      return reply.status(400).send({
        message:
          "Perfil incompleto. Complete seu perfil antes de agendar a campanha.",
      });
    }

    // Fallback
    console.log(err)
    return reply.status(500).send({ message: "Internal server error." });
  }
}
