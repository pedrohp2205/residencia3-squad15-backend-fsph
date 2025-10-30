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
      birthDate: Date
      phone: string
      gender: Gender
      bloodType: BloodType
      completed: boolean
      name?: string
      cpf?: string
    }
  ): Promise<Profile> {

    if (data.name || data.cpf) {
      prisma.user.update({
        where: { id: userId },
        data: {
          name: data.name,
          cpf: data.cpf,
        },
      })
    }
    

    return prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        birthDate: data.birthDate,
        phone: data.phone,
        gender: data.gender,
        bloodType: data.bloodType,
        completed: data.completed,
      },
      update: {
        phone: data.phone,
        gender: data.gender,
        birthDate: data.birthDate,
        bloodType: data.bloodType,
        completed: data.completed,
      },
    })
  }
}
