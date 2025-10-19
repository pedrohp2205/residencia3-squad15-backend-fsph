import { FastifyReply, FastifyRequest } from "fastify"

export async function verifyJwt(req: FastifyRequest, reply: FastifyReply) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized.' })
  }
  try {
    await req.jwtVerify() 
  } catch {
    return reply.code(401).send({ message: 'Unauthorized.' })
  }
}
