import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCompleteProfileUseCase } from "../../../use-cases/factories/make-complete-profile-use-case";
import type { BloodType } from "@prisma/client";

export async function completeProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const sexes = ["M", "F", "OTHER"] as const;
  const bloodTypes = ["A+","A-","B+","B-","AB+","AB-","O+","O-"] as const;

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

  // Agora todos os campos são obrigatórios
  const bodySchema = z.object({
    phone: z.string().min(8).max(20),
    sex: z.enum(sexes),
    bloodType: z.enum(bloodTypes),
    dateOfBirth: z.coerce.date(),
  });

  const { phone, sex, bloodType, dateOfBirth } = bodySchema.parse(request.body);

  const useCase = makeCompleteProfileUseCase();

  const payload: {
    userId: string;
    phone: string;
    gender: typeof sexes[number];
    dateOfBirth: Date;
    bloodType: BloodType;
  } = {
    userId: request.user.sub,
    phone,
    gender: sex,
    dateOfBirth,
    bloodType: bloodTypeEnumMap[bloodType],
  };

  const result = await useCase.execute(payload);
  const { profile } = result;

  return reply.status(200).send({
    id: profile.id,
    userId: profile.userId,
    phone: profile.phone,
    sex: profile.gender,
    bloodType: profile.bloodType,
    completed: profile.completed,
  });
}
