import {
  PostDTO,
  PostsRepository,
  PostWithRelations,
} from "@/repositories/posts-repository";
import { PostNotFoundError } from "../errors/post-not-found-error";

interface FetchPostsUseCaseRequest {
  currentUserId?: string;
  take?: number;
  cursor?: string;
}

export class FetchPostsUseCase {
  constructor(private postsRepository: PostsRepository) {}

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

    if (!posts) throw new PostNotFoundError();

    return posts;
  }
}
