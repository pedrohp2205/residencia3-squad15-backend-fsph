import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { LikePostUseCase } from "../posts/like-post";
import { GetDonorProfileUseCase } from "../donation/get-donor-profile";
import { AxiosFpshGateway } from "@/http/axios-fpsh-gateway";

export function makeGetDonorProfileUseCase() {
  const fpshGateway = new AxiosFpshGateway();

  const getDonorProfileUseCase = new GetDonorProfileUseCase(fpshGateway);

  return getDonorProfileUseCase;
}

