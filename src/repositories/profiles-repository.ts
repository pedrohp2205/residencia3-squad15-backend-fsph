import { Profile } from "@prisma/client"

export interface ProfilesRepository {
  findByCpf(cpf: string): Promise<Profile | null>
  upsertByUserId(
    userId: string,
    data: {
      cpf: string
      phone: string
      gender: string
      bloodType: string
      completed: boolean
    },
  ): Promise<Profile>
}
