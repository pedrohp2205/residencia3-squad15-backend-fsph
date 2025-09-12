import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCompleteProfileUseCase } from "../../../use-cases/factories/make-complete-profile-use-case";
import {
  cpfIsValid,
  normalizeCpf,
  normalizePhone,
} from "../../../utils/br-validators";
import type { BloodType } from "@prisma/client";

export async function completeProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const sexes = ["M", "F", "OTHER"] as const;
  const bloodTypes = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ] as const;

  const bloodTypeEnumMap: Record<(typeof bloodTypes)[number], BloodType> = {
    "A+": "A_POS",
    "A-": "A_NEG",
    "B+": "B_POS",
    "B-": "B_NEG",
    "AB+": "AB_POS",
    "AB-": "AB_NEG",
    "O+": "O_POS",
    "O-": "O_NEG",
  };

  const bodySchema = z.object({
    cpf: z
      .string()
      .min(11)
      .max(14)
      .transform((v) => normalizeCpf(v))
      .refine((v) => cpfIsValid(v), "CPF inválido"),
    phone: z
      .string()
      .min(8)
      .max(20)
      .transform((v) => normalizePhone(v)),
    sex: z.enum(sexes),
    bloodType: z.enum(bloodTypes),
    dateOfBirth: z.string().optional(),
    address: z
      .object({
        street: z.string(),
        number: z.string(),
        neighborhood: z.string(),
        city: z.string(),
        state: z.string().length(2),
        zipcode: z.string(),
        complement: z.string().optional(),
      })
      .optional(),
  });

  const { cpf, phone, sex, bloodType } = bodySchema.parse(request.body);

  const useCase = makeCompleteProfileUseCase();

  const result = await useCase.execute({
    userId: request.user.sub,
    cpf,
    phone,
    gender: sex,
    bloodType: bloodTypeEnumMap[bloodType],
  });

  const { profile } = result;

  return reply.status(200).send({
    id: profile.id,
    userId: profile.userId,
    cpf: profile.cpf,
    phone: profile.phone,
    sex: profile.gender,
    bloodType: profile.bloodType,
    completed: profile.completed,
  });
}
