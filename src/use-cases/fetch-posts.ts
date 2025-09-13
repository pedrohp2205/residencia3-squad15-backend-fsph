import {
  PostsRepository,
  PostWithRelations,
} from "@/repositories/posts-repository";
import { PostNotFoundError } from "./errors/post-not-found-error";

export class FetchPostsUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute(): Promise<PostWithRelations[]> {
    const posts = await this.postsRepository.findAll();

    if (!posts) throw new PostNotFoundError();

    return posts;
  }
}
