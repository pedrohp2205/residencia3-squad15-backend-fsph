import { StorageProvider } from "@/storage/storage-provider";
import { UsersRepository } from "../repositories/users-repository";
import { PostsRepository } from "@/repositories/posts-repository";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error";

interface CreatePostUseCaseRequest {
  authorId: string;
  content: string;
  fileName: string;
  fileType: string;
  body: Buffer;
}

interface CreatePostUseCaseResponse {
  postId: string;
}

export class CreatePostUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private postsRepository: PostsRepository,
    private storageProvider: StorageProvider
  ) {}

  async execute({
    authorId,
    content,
    body,
    fileName,
    fileType,
  }: CreatePostUseCaseRequest): Promise<CreatePostUseCaseResponse> {
    const user = await this.usersRepository.findById(authorId);

    if (!user) throw new UserNotFoundError();

    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      throw new InvalidAttachmentTypeError(fileType);
    }

    const { key } = await this.storageProvider.upload({
      fileName,
      fileType,
      body,
      folder: `users/${authorId}/posts`,
    });

    const post = await this.postsRepository.create({
      authorId,
      content,
      mediaUrl: key,
    });

    return { postId: post };
  }
}
