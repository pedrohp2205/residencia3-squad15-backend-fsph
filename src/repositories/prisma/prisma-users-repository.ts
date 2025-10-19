import { prisma } from "../../infra/prisma";
import { Prisma, User } from "@prisma/client";
import {
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
}
