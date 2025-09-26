import { Prisma, User } from "@prisma/client";
type ProfileCpfOnly = Pick<Prisma.ProfileCreateWithoutUserInput, "cpf">;

export interface CreateUserWithCpfInput {
  name: string;
  email: string;
  passwordHash?: string;
  profile: {
    create: ProfileCpfOnly;
  };
}

export type UserWithProfile = Prisma.UserGetPayload<{
  include: {
    profile: true;
  };
}>;

export interface UsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<UserWithProfile | null>;
  create(data: CreateUserWithCpfInput): Promise<User>;
  cpfExists(cpf: string): Promise<boolean>;
}
