import type { Prisma } from "@prisma/client";
import { PreScreeningRepository } from "../pre-screening-repository";
import { prisma } from "@/infra/prisma";

export class PrismaPreScreeningRepository implements PreScreeningRepository {
    async save(data: Prisma.PreScreeningUncheckedCreateInput): Promise<void> {
        await prisma.preScreening.create({
            data,
        });
    }
}