import { Post, Prisma } from "@prisma/client";
import { PostsRepository } from "../posts-repository";
import { prisma } from "@/infra/prisma";

export class PrismaPostsRepository implements PostsRepository {
  async create(data: Prisma.PostUncheckedCreateInput): Promise<string> {
    const post = await prisma.post.create({
      data,
    });
    return post.id;
  }

  async findAll(): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts;
  }
}
