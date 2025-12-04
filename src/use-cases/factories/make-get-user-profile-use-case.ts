import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { GetDonorProfileUseCase } from "../donation/get-donor-profile";
import { GetUserProfileUseCase } from "../users/get-user-profile";
  

export function makeGetUserProfileUseCase() {
    const usersRepository = new PrismaUsersRepository();

    const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);
    
    return getUserProfileUseCase;
}

