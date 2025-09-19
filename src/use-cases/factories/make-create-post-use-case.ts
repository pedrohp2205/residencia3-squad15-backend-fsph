import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { R2Provider } from "@/infra/r2-provider";
import { CreatePostUseCase } from "../posts/create-post";

export function makeCreatePostUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const postsRepository = new PrismaPostsRepository();
  const storageProvider = new R2Provider();

  const createPostUseCase = new CreatePostUseCase(
    usersRepository,
    postsRepository,
    storageProvider
  );

  return createPostUseCase;
}
