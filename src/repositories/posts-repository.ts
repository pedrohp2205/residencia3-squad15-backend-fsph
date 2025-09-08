import { Post, Prisma } from "@prisma/client";

export interface PostsRepository {
  create(data: Prisma.PostUncheckedCreateInput): Promise<string>;
  findAll(): Promise<Post[]>;
}
