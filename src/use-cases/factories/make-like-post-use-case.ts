import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { LikePostUseCase } from "../posts/like-post";

export function makeLikePostUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const postsRepository = new PrismaPostsRepository();

  const likePostUseCase = new LikePostUseCase(usersRepository, postsRepository);

  return likePostUseCase;
}
