import { UsersRepository, UserWithProfile } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";

interface GetUserProfileUseCaseRequest {
  userId: string;
}

interface GetUserProfileUseCaseResponse {
  profile: UserWithProfile;
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const userWithProfile = await this.usersRepository.findByEmail(user.email);



    return {
      profile: userWithProfile!,
    };
  }
}
