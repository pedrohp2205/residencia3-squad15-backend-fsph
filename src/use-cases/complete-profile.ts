import { ProfilesRepository } from '../repositories/profiles-repository'
import { UsersRepository } from '../repositories/users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import { Profile } from '@prisma/client'
import { BadRequestError } from './errors/bad-request-error'

interface CompleteProfileUseCaseRequest {
  userId: string
  cpf: string
  phone: string
  gender: 'M' | 'F' | 'OTHER'
  bloodType: 'A_POS' | 'A_NEG' | 'B_POS' | 'B_NEG' | 'AB_POS' | 'AB_NEG' | 'O_POS' | 'O_NEG'
}

interface CompleteProfileUseCaseResponse {
  profile: Profile
}

export class CompleteProfileUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private profilesRepository: ProfilesRepository,
  ) {}

  async execute({
    userId,
    cpf,
    phone,
    gender,
    bloodType,
  }: CompleteProfileUseCaseRequest): Promise<CompleteProfileUseCaseResponse> {
    
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new UserNotFoundError()
    }

    
    const existing = await this.profilesRepository.findByCpf(cpf)
    if (existing && existing.userId !== userId) {
      throw new BadRequestError()
    }

    
    const profile = await this.profilesRepository.upsertByUserId(userId, {
      cpf,
      phone,
      gender,
      bloodType,
      completed: true,
    })

    return {
      profile,
    }
  }
}
