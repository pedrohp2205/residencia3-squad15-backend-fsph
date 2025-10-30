import { Profile } from "@prisma/client"

export interface ProfilesRepository {
  // findByCpf(cpf: string): Promise<Profile | null>
  findByUserId(userId: string): Promise<Profile | null>
  
  upsertByUserId(
    userId: string,
    data: {
      birthDate: Date
      phone: string
      gender: string
      bloodType: string
      completed: boolean
      name?: string
      cpf?: string
    },
  ): Promise<Profile>
}
