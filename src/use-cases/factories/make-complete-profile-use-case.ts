import { PrismaProfilesRepository } from "../../repositories/prisma/prisma-profiles-repository";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { CompleteProfileUseCase } from "../posts/complete-profile";

export function makeCompleteProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const profilesRepository = new PrismaProfilesRepository();
  return new CompleteProfileUseCase(usersRepository, profilesRepository);
}
