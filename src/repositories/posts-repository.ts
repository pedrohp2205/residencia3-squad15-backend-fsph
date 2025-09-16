import { Post, Prisma } from "@prisma/client";

export type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    comments: {
      include: {
        user: {
          select: {
            id: true;
            name: true;
            email: true;
          };
        };
      };
    };
    _count: {
      select: {
        likes: true;
      };
    };
  };
}>;

export type PostDTO = PostWithRelations & { hasLiked: boolean };

export interface PostsRepository {
  create(data: Prisma.PostUncheckedCreateInput): Promise<string>;
  findAll(params?: {
    currentUserId?: string;
    take?: number;
    cursor?: string;
  }): Promise<PostDTO[]>;
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
  commentPost({
    postId,
    userId,
    content,
  }: {
    postId: string;
    userId: string;
    content: string;
  }): Promise<void>;
}
