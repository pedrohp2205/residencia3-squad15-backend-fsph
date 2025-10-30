import { OAuthAccount, Prisma, User } from "@prisma/client";

export type UserWithProfile = Prisma.UserGetPayload<{
  include: {
    profile: true;
  };
}>;

export interface CreateOAuthUserInput {
  name?: string | null
  email: string
  avatarUrl?: string | null
  oauth: { provider: 'google'; providerId: string }
}


export interface UsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<UserWithProfile | null>;
  create(data: Prisma.UserUncheckedCreateInput): Promise<User>;
  cpfExists(cpf: string): Promise<boolean>;

  // findByEmailOAuth(email: string): Promise<(User & { accounts: OAuthAccount[] }) | null>
  findByOAuth(provider: 'google', providerId: string): Promise<(User & { accounts: OAuthAccount[] }) | null>
  createUserWithOAuth(data: CreateOAuthUserInput): Promise<User & { accounts: OAuthAccount[] }>
  linkOAuthAccount(userId: string, provider: 'google', providerId: string): Promise<OAuthAccount>
  isUserLinkedToOAuthProvider(userId: string, provider: 'google'): Promise<boolean>
}

