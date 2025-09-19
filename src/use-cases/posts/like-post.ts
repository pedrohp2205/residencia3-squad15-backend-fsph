import { UsersRepository } from "@/repositories/users-repository";
import { PostsRepository } from "@/repositories/posts-repository";
import { UserNotFoundError } from "../errors/user-not-found-error";
import { PostNotFoundError } from "../errors/post-not-found-error";

interface LikePostUseCaseRequest {
  postId: string;
  userId: string;
}

export class LikePostUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private postsRepository: PostsRepository
  ) {}

  async execute({ postId, userId }: LikePostUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw new UserNotFoundError();

    const post = await this.postsRepository.findById(postId);

    if (!post) throw new PostNotFoundError();

    const hasUserLikedPost = await this.postsRepository.hasUserLikedPost({
      postId,
      userId,
    });

    if (hasUserLikedPost) {
      await this.postsRepository.likePost({
        postId,
        userId,
        isAlreadyLiked: true,
      });
      return;
    }

    await this.postsRepository.likePost({
      postId,
      userId,
    });

    return;
  }
}
