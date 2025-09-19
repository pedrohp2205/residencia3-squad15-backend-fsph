import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { CommentPostUseCase } from "../posts/comment-post";

export function makeCommentPostUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const postsRepository = new PrismaPostsRepository();

  const commentPostUseCase = new CommentPostUseCase(
    usersRepository,
    postsRepository
  );

  return commentPostUseCase;
}
