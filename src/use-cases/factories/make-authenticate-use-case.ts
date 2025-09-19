import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "../auth/authenticate";

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository();
  return new AuthenticateUseCase(usersRepository);
}
