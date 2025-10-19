import { UsersRepository } from "@/repositories/users-repository";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";
import { User } from "@prisma/client";
import { hash } from "bcryptjs";
import { cpfIsValid, normalizeCpf } from "@/utils/br-validators";
import { CpfNotValidError } from "../errors/cpf-not-valid";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
  cpf: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    cpf,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const isCpfValid = cpfIsValid(cpf);

    if (!isCpfValid) {
      throw new CpfNotValidError();
    }

    const cpfExists = await this.usersRepository.cpfExists(cpf);

    if (cpfExists) {
      throw new CpfNotValidError();
    }

    const normalizedCpf = normalizeCpf(cpf);

    const user = await this.usersRepository.create({
      name,
      email,
      passwordHash: password_hash,
      cpf: normalizedCpf,
    });

    return {
      user,
    };
  }
}
