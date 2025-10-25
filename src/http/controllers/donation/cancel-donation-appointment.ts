import { z } from "zod"
import { FastifyRequest, FastifyReply } from "fastify"
import { makeCancelDonationAppointmentUseCase } from "@/use-cases/factories/make-cancel-donation-appointment-use-case"

export async function cancelDonationAppointment(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const cancelSchema = z.object({
    protocol: z.string().min(1, "Protocolo obrigatório"),
  })

  const { protocol } = cancelSchema.parse(request.body)

  const useCase = makeCancelDonationAppointmentUseCase()

  const { success } = await useCase.execute({ protocol })
  
  const payload = {
    success,
    message: success
      ? 'Agendamento cancelado com sucesso.'
      : 'Agendamento não encontrado.'
  }

  return reply.status(success ? 200 : 404).send(payload)
}


