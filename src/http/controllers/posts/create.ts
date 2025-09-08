import { FastifyReply, FastifyRequest } from "fastify";
import { makeCreatePostUseCase } from "@/use-cases/factories/make-create-post-use-case";
import { UserNotFoundError } from "@/use-cases/errors/user-not-found-error";
import { InvalidAttachmentTypeError } from "@/use-cases/errors/invalid-attachment-type-error";

const ACCEPTED_MIME = new Set(["image/png", "image/jpeg"]);

export async function createPost(request: FastifyRequest, reply: FastifyReply) {
  let content: string | undefined;
  let fileName: string | undefined;
  let fileType: string | undefined;
  let body: Buffer | undefined;
  let fileCount = 0;

  for await (const part of (request as any).parts()) {
    if (part.type === "file") {
      fileCount++;
      if (fileCount > 1) {
        return reply.status(400).send({ message: "Envie apenas 1 imagem." });
      }
      if (!ACCEPTED_MIME.has(part.mimetype)) {
        return reply
          .status(400)
          .send({ message: "Tipo de arquivo não permitido. Use PNG ou JPEG." });
      }
      fileName = part.filename;
      fileType = part.mimetype;
      body = await part.toBuffer();
    } else if (part.type === "field" && part.fieldname === "content") {
      content =
        typeof part.value === "string" ? part.value : String(part.value);
    }
  }

  if (!content || content.trim().length === 0) {
    return reply.status(400).send({ message: "Field 'content' is required." });
  }
  if (!fileName || !fileType || !body) {
    return reply
      .status(400)
      .send({ message: "Envie exatamente 1 imagem (PNG ou JPEG)." });
  }
  if (content.length > 280) {
    return reply
      .status(400)
      .send({ message: "content deve ter no máximo 280 caracteres." });
  }

  try {
    const useCase = makeCreatePostUseCase();

    const result = await useCase.execute({
      authorId: request.user.sub,
      content,
      fileName,
      fileType,
      body,
    });

    return reply.status(201).send(result ?? { ok: true });
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof InvalidAttachmentTypeError) {
      return reply.status(400).send({ message: err.message });
    }
    request.log.error(err);
    throw err;
  }
}
