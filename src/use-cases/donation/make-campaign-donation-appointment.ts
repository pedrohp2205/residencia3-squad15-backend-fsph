import { FpshGateway } from "@/ports/fpsh-gateway";
import { ProfilesRepository } from "@/repositories/profiles-repository";
import { ProfileNotCompletedError } from "../errors/profile-not-completed-error";
import { UsersRepository } from "@/repositories/users-repository";
import { UserNotFoundError } from "../errors/user-not-found-error";
import { PreScreeningRepository } from "@/repositories/pre-screening-repository";

interface MakeCampaignDonationAppointmentUseCaseRequest {
    userId: string;
    shift: "morning" | "afternoon" ;
    date: Date;
    amountOfDonors: number;
}

interface MakeCampaignDonationAppointmentUseCaseResponse {
  appointment: any;
}

export class MakeCampaignDonationAppointmentUseCase {
  constructor(
    private fpshGateway: FpshGateway,
    private profileRepository: ProfilesRepository,
    private usersRepository: UsersRepository,
    private preScreeningRepository: PreScreeningRepository
) {}

  async execute(
    request: MakeCampaignDonationAppointmentUseCaseRequest
  ): Promise<MakeCampaignDonationAppointmentUseCaseResponse> {
    const { userId, shift, date, amountOfDonors } = request;

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const profile =  await this.profileRepository.findByUserId(userId);

    if (!profile || !profile.completed) {
      throw new ProfileNotCompletedError();
    }

    const response = await this.fpshGateway.makeCampaignAppointment({
        responsibleName: user.name,
        responsibleBirthDate: profile.birthDate!.toDateString(),
        responsibleEmail: user.email,
        responsibleCpf: user.cpf!,
        responsiblePhone: profile.phone!,
        responsibleGender: profile.gender!,
        shift,
        date: date.toDateString(),
        donorsQuantity: amountOfDonors
    });

    return { appointment: response };
  }
}
