import { Prisma, User } from "@prisma/client";

export type UserWithProfile = Prisma.UserGetPayload<{
  include: {
    profile: true;
  };
}>;

export interface UsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<UserWithProfile | null>;
  create(data: Prisma.UserUncheckedCreateInput): Promise<User>;
  cpfExists(cpf: string): Promise<boolean>;
}
