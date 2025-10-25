import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { OAuth2Client } from 'google-auth-library'
import { makeAuthenticateWithGoogleUseCase } from '@/use-cases/factories/make-authenticate-with-google-use-case'

const bodySchema = z.object({ idToken: z.string().min(20) })

export async function googleIdController(request: FastifyRequest, reply: FastifyReply) {
  const { idToken } = bodySchema.parse(request.body)

  const client = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID!)
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_WEB_CLIENT_ID!,
  })
  const payload = ticket.getPayload()
  if (!payload?.email || !payload.email_verified) {
    return reply.status(403).send({ message: 'Email do Google não verificado' })
  }

  const useCase = makeAuthenticateWithGoogleUseCase()
  const { user } = await useCase.execute({
    googleSub: payload.sub!,
    email: payload.email!,
    emailVerified: payload.email_verified!,
    name: payload.name!,
  })

  const token = await reply.jwtSign({ sub: user.id }, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' })
  const refreshToken = await reply.jwtSign({ sub: user.id }, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' })

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: true,          
      secure: true,            
    })
    .status(200)
    .send({ token, refreshToken })
}
