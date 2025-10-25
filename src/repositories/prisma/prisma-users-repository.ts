import { prisma } from "../../infra/prisma";
import { Prisma, User } from "@prisma/client";
import {
  CreateOAuthUserInput,
  UsersRepository, 
} from "../users-repository";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: { profile: true },
    });

    return user;
  }

  async create(data: Prisma.UserUncheckedCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        cpf: data.cpf,
      },
      include: { profile: true },
    });

    return user;
  }

  async cpfExists(cpf: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: {
        cpf,
      },
    });

    return user !== null;
  }


  findByOAuth(provider: 'google', providerId: string) {
    return prisma.user.findFirst({
      where: { accounts: { some: { provider, providerId } } },
      include: { accounts: true },
    })
  }

  async createUserWithOAuth(data: CreateOAuthUserInput) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name ?? 'Usuário',
          email: data.email,
          passwordHash: null,           
        },
      })
      await tx.oAuthAccount.create({
        data: { provider: data.oauth.provider, providerId: data.oauth.providerId, userId: user.id },
      })
      return tx.user.findUniqueOrThrow({ where: { id: user.id }, include: { accounts: true } })
    })
  }

  async linkOAuthAccount(userId: string, provider: 'google', providerId: string) {
    return await prisma.oAuthAccount.create({ data: { provider, providerId, userId } })
  }
}
