import { prisma } from "../../infra/prisma";
import { Prisma } from "@prisma/client";

import {
  CreateUserWithCpfInput,
  UsersRepository,
  UserWithProfile,
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

  async create(data: CreateUserWithCpfInput): Promise<UserWithProfile> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        profile: {
          create: {
            cpf: data.profile.create.cpf,
          },
        },
      },
      include: { profile: true },
    });

    return user;
  }

  async cpfExists(cpf: string): Promise<boolean> {
    const user = await prisma.profile.findUnique({
      where: {
        cpf,
      },
    });

    return user !== null;
  }
}
