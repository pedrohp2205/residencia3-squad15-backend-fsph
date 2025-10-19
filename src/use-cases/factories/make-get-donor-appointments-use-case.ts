import { AxiosFpshGateway } from "@/http/axios-fpsh-gateway";
import { GetDonorAppointmentsUseCase } from "../donation/get-donor-appointments";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export function makeGetDonorAppointmentsUseCase() {
  const fpshGateway = new AxiosFpshGateway();
  const usersRepository = new PrismaUsersRepository();

  const getDonorAppointmentsUseCase = new GetDonorAppointmentsUseCase(fpshGateway, usersRepository);

  return getDonorAppointmentsUseCase;
}

