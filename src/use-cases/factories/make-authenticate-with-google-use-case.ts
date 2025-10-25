import { AuthenticateWithGoogleUseCase } from "../auth/authenticate-with-google"
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'


export function makeAuthenticateWithGoogleUseCase() {
  const repo = new PrismaUsersRepository()
  return new AuthenticateWithGoogleUseCase(repo)
}
