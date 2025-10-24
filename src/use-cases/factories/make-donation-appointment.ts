import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { PrismaPreScreeningRepository } from "@/repositories/prisma/prisma-pre-screening-repository";
import { PrismaProfilesRepository } from "@/repositories/prisma/prisma-profiles-repository";
import { AxiosFpshGateway } from "@/http/axios-fpsh-gateway";
import { MakeDonationAppointmentUseCase } from "../donation/make-donation-appointment";

export function makeMakeDonationAppointmentUseCase() {
    const usersRepository = new PrismaUsersRepository();
    const preScreeningRepository = new PrismaPreScreeningRepository();
    const profilesRepository = new PrismaProfilesRepository();
    const fpshGateway = new AxiosFpshGateway();

  return new MakeDonationAppointmentUseCase(
    fpshGateway,
    profilesRepository,
    usersRepository,
    preScreeningRepository
  );
}

