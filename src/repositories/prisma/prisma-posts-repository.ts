import { Post, Prisma } from "@prisma/client";
import {
  PostDTO,
  PostsRepository,
  PostWithRelations,
} from "../posts-repository";
import { prisma } from "@/infra/prisma";

export class PrismaPostsRepository implements PostsRepository {
  async likePost({
    postId,
    userId,
    isAlreadyLiked,
  }: {
    postId: string;
    userId: string;
    isAlreadyLiked: boolean;
  }): Promise<void> {
    if (isAlreadyLiked) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      return;
    }

    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
  }

  async findById(postId: string): Promise<Post | null> {
    return await prisma.post.findUnique({
      where: { id: postId },
    });
  }

  async delete(postId: string): Promise<void> {
    await prisma.post.delete({
      where: { id: postId },
    });
  }

  async hasUserLikedPost({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }): Promise<boolean> {
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return !!like;
  }

  async create(data: Prisma.PostUncheckedCreateInput): Promise<string> {
    const post = await prisma.post.create({
      data,
    });
    return post.id;
  }

  async findAll(params?: {
    currentUserId?: string;
    take?: number;
    cursor?: string;
  }): Promise<PostDTO[]> {
    const { currentUserId, take = 20, cursor } = params ?? {};

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        author: { select: { id: true, name: true, email: true } },
        comments: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        _count: { select: { likes: true } },
        // 🔑 pega só o like do usuário atual (se existir)
        ...(currentUserId
          ? {
              likes: {
                where: { userId: currentUserId },
                select: { id: true }, // mínimo necessário
              },
            }
          : {}),
      },
    });

    // Mapeia likes filtrados -> booleano
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (posts as any[]).map((p) => {
      const hasLiked = Array.isArray(p.likes) ? p.likes.length > 0 : false;
      // remove o array likes filtrado do payload final (opcional)
      const { likes, ...rest } = p;
      return { ...rest, hasLiked } as PostDTO;
    });
  }

  async commentPost({
    postId,
    userId,
    content,
  }: {
    postId: string;
    userId: string;
    content: string;
  }): Promise<void> {
    await prisma.comment.create({
      data: {
        postId,
        userId,
        text: content,
      },
    });
  }
}
