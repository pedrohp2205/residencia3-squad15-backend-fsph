import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    refreshToken: z.string().min(1).optional(),
  });

  const { refreshToken } = bodySchema.parse(request.body ?? {});

  const cookieRefreshToken =
    
    (request.cookies as any)?.Authorization ||
    (request.cookies as any)?.refreshToken;

  const rawRefreshToken = refreshToken ?? cookieRefreshToken;

  if (!rawRefreshToken) {
    return reply.status(401).send({
      statusCode: 401,
      error: "Unauthorized",
      message: "Refresh token não encontrado",
    });
  }

  try {

    const payload = await request.server.jwt.verify(rawRefreshToken);
    const { sub } = payload as { sub: string };

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub,
        },
      }
    );

    return reply.status(200).send({ token });
  } catch (err) {
    console.log("Erro ao verificar refresh token:", err);

    return reply.status(401).send({
      statusCode: 401,
      error: "Unauthorized",
      message: "Refresh token inválido ou expirado",
    });
  }
}
