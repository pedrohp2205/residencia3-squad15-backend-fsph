import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository";
import { FetchPostsUseCase } from "../fetch-posts";

export function makeFetchPostsUseCase() {
  const postsRepository = new PrismaPostsRepository();

  const fetchPostsUseCase = new FetchPostsUseCase(postsRepository);

  return fetchPostsUseCase;
}
