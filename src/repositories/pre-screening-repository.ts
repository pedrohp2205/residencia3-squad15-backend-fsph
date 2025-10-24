import { Prisma } from "@prisma/client";

export interface PreScreeningRepository {
    save(data: Prisma.PreScreeningUncheckedCreateInput): Promise<void>;
}