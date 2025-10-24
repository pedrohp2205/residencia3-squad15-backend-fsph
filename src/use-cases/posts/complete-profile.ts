import { ProfilesRepository } from "@/repositories/profiles-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { UserNotFoundError } from "../errors/user-not-found-error";
import { ProfileAlreadyCompletedError } from "../errors/profile-already-completed-error";
import { Profile } from "@prisma/client";

interface CompleteProfileUseCaseRequest {
  userId: string;
  phone: string;
  dateOfBirth: Date;
  gender: "M" | "F" | "OTHER";
  bloodType:
    | "A_POS"
    | "A_NEG"
    | "B_POS"
    | "B_NEG"
    | "AB_POS"
    | "AB_NEG"
    | "O_POS"
    | "O_NEG";
}

interface CompleteProfileUseCaseResponse {
  profile: Profile;
}

export class CompleteProfileUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private profilesRepository: ProfilesRepository
  ) {}

  async execute({
    userId,
    phone,
    gender,
    dateOfBirth,
    bloodType,
  }: CompleteProfileUseCaseRequest): Promise<CompleteProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new UserNotFoundError();

    const existing = await this.profilesRepository.findByUserId(userId);

    if (existing && existing.completed) {
      throw new ProfileAlreadyCompletedError();
    }

    const profile = await this.profilesRepository.upsertByUserId(userId, {
      phone,
      gender,
      bloodType,
      birthDate: dateOfBirth,
      completed: true,
    });

    return { profile };
  }
}
