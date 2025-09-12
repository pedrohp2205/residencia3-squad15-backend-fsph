import { Post, Prisma } from "@prisma/client";

export interface PostsRepository {
  create(data: Prisma.PostUncheckedCreateInput): Promise<string>;
  findAll(): Promise<Post[]>;
  likePost({
    postId,
    userId,
    isAlreadyLiked,
  }: {
    postId: string;
    userId: string;
    isAlreadyLiked?: boolean;
  }): Promise<void>;
  findById(postId: string): Promise<Post | null>;
  delete(postId: string): Promise<void>;
  hasUserLikedPost({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }): Promise<boolean>;
}
