import { UsersRepository } from "../repositories/users-repository";
import { PostsRepository } from "@/repositories/posts-repository";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { PostNotFoundError } from "./errors/post-not-found-error";

interface CommentPostUseCaseRequest {
  postId: string;
  userId: string;
  content: string;
}

export class CommentPostUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private postsRepository: PostsRepository
  ) {}

  async execute({
    postId,
    userId,
    content,
  }: CommentPostUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw new UserNotFoundError();

    const post = await this.postsRepository.findById(postId);

    if (!post) throw new PostNotFoundError();

    await this.postsRepository.commentPost({ postId, userId, content });

    return;
  }
}
