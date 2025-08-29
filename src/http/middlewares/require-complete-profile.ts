import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../infra/prisma'

export async function requireCompleteProfile(req: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = req.user as { sub: string }

  const profile = await prisma.profile.findUnique({
    where: { userId }, 
    select: { completed: true },
  })

  if (!profile?.completed) {
    return reply.status(403).send({
      code: 'PROFILE_INCOMPLETE',
      message: 'Complete seu perfil para continuar.',
    })
  }
}
