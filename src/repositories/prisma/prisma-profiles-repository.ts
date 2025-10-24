import { prisma } from '../../infra/prisma'
import type { Profile, Gender, BloodType } from '@prisma/client'
import type { ProfilesRepository } from '../profiles-repository'

export class PrismaProfilesRepository implements ProfilesRepository {
  // async findByCpf(cpf: string): Promise<Profile | null> {
  //   return prisma.profile.findFirst({
  //     where: { cpf },
  //   })
  // }

  async findByUserId(userId: string): Promise<Profile | null> {
    return prisma.profile.findUnique({
      where: { userId }, 
    })
  }

  async upsertByUserId(
    userId: string,
    data: {
      // cpf: string
      birthDate: Date
      phone: string
      gender: Gender
      bloodType: BloodType
      completed: boolean
    }
  ): Promise<Profile> {
    return prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        // cpf: data.cpf,
        birthDate: data.birthDate,
        phone: data.phone,
        gender: data.gender,
        bloodType: data.bloodType,
        completed: data.completed,
      },
      update: {
        // cpf: data.cpf,
        phone: data.phone,
        gender: data.gender,
        birthDate: data.birthDate,
        bloodType: data.bloodType,
        completed: data.completed,
      },
    })
  }
}
