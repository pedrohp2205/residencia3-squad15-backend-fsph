import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'

interface AuthenticateWithGoogleUseCaseRequest {
  googleSub: string
  email: string
  emailVerified: boolean
  name: string
}

interface AuthenticateWithGoogleUseCaseResponse { 
    user: User; 
    isNew: boolean 
}

export class AuthenticateWithGoogleUseCase {
  constructor(private users: UsersRepository) {}

  async execute({ googleSub, email, emailVerified, name }: AuthenticateWithGoogleUseCaseRequest): Promise<AuthenticateWithGoogleUseCaseResponse> {
    if (!emailVerified) throw new Error('Email do Google não verificado')

    const byProvider = await this.users.findByOAuth('google', googleSub)
    if (byProvider) return { user: byProvider, isNew: false }

    const byEmail = await this.users.findByEmail(email)
    if (byEmail) {
      await this.users.linkOAuthAccount(byEmail.id, 'google', googleSub)
      const reloaded = await this.users.findByEmail(email)

      return { user: reloaded!, isNew: false }
    } 

    const created = await this.users.createUserWithOAuth({
      email,
      oauth: { provider: 'google', providerId: googleSub },
    })
    return { user: created, isNew: true }
  }
}
