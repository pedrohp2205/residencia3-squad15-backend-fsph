import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository";
import { FetchPostsUseCase } from "../posts/fetch-posts";
import { R2Provider } from "@/infra/r2-provider";

export function makeFetchPostsUseCase() {
  const postsRepository = new PrismaPostsRepository();
  const storageProvider = new R2Provider();

  const fetchPostsUseCase = new FetchPostsUseCase(postsRepository, storageProvider);

  return fetchPostsUseCase;
}
