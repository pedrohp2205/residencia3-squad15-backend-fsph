import {
  PostDTO,
  PostsRepository,
} from "@/repositories/posts-repository";
import { PostNotFoundError } from "../errors/post-not-found-error";
import { StorageProvider } from "@/storage/storage-provider";

interface FetchPostsUseCaseRequest {
  currentUserId?: string;
  take?: number;
  cursor?: string;
}

export class FetchPostsUseCase {
  constructor(
    private postsRepository: PostsRepository,
    private storageProvider: StorageProvider
  ) {}

  async execute({
    currentUserId,
    take,
    cursor,
  }: FetchPostsUseCaseRequest): Promise<PostDTO[]> {
    const posts = await this.postsRepository.findAll({
      currentUserId,
      take,
      cursor,
    });

    // se o repo sempre retorna array, esse if nem dispara, mas deixei
    if (!posts || posts.length === 0) {
      throw new PostNotFoundError();
    }

    const postsWithSignedUrl = await Promise.all(
      posts.map(async (post) => {
        if (!post.mediaUrl) {
          return post;
        }

        const signedUrl = await this.storageProvider.getPresignedUrlFromKey(
          post.mediaUrl
        );

        return {
          ...post,
          mediaUrl: signedUrl,
        };
      })
    );

    return postsWithSignedUrl;
  }
}
