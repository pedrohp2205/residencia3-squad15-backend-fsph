import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { PrismaPreScreeningRepository } from "@/repositories/prisma/prisma-pre-screening-repository";
import { PrismaProfilesRepository } from "@/repositories/prisma/prisma-profiles-repository";
import { AxiosFpshGateway } from "@/http/axios-fpsh-gateway";
import { MakeCampaignDonationAppointmentUseCase } from "../donation/make-campaign-donation-appointment";


export function makeMakeDonationCampaignAppointmentUseCase() {
    const usersRepository = new PrismaUsersRepository();
    const preScreeningRepository = new PrismaPreScreeningRepository();
    const profilesRepository = new PrismaProfilesRepository();
    const fpshGateway = new AxiosFpshGateway();

  return new MakeCampaignDonationAppointmentUseCase(
    fpshGateway,
    profilesRepository,
    usersRepository,
    preScreeningRepository
  );
}

