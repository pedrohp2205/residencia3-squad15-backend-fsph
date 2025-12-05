import { FpshGateway } from "@/ports/fpsh-gateway";
import { ProfilesRepository } from "@/repositories/profiles-repository";
import { ProfileNotCompletedError } from "../errors/profile-not-completed-error";
import { UsersRepository } from "@/repositories/users-repository";
import { UserNotFoundError } from "../errors/user-not-found-error";
import { PreScreeningRepository } from "@/repositories/pre-screening-repository";

interface MakeDonationAppointmentUseCaseRequest {
  userId: string;
  appointmentType: "D" | "M";
  timeBlockId: number;
  firstTimeDonating: boolean;
  weightMoreThanFiftyKg: boolean;
  wasTatooedInPlaceNotCertified: boolean;
}

interface MakeDonationAppointmentUseCaseResponse {
  appointment: any;
}

export class MakeDonationAppointmentUseCase {
  constructor(
    private fpshGateway: FpshGateway,
    private profileRepository: ProfilesRepository,
    private usersRepository: UsersRepository,
    private preScreeningRepository: PreScreeningRepository
) {}

  async execute(
    request: MakeDonationAppointmentUseCaseRequest
  ): Promise<MakeDonationAppointmentUseCaseResponse> {
    const { userId, appointmentType, timeBlockId } = request;

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const profile =  await this.profileRepository.findByUserId(userId);

    if (!profile || !profile.completed) {
      throw new ProfileNotCompletedError();
    }

    this.preScreeningRepository.save({
      userId,
      firstTimeDonating: request.firstTimeDonating,
      weightMoreThanFiftyKilograms: request.weightMoreThanFiftyKg,
      wasTatooedInANonVerifiedPlace: request.wasTatooedInPlaceNotCertified,
      gender: profile.gender!,
    });



    const response = await this.fpshGateway.makeAnAppointment({
      donorName: user.name!,
      donorBirthDate: profile.birthDate!.toISOString(),
      donorEmail: user.email,
      donorCpf: user.cpf!,
      donorPhone: profile.phone!,
      donorGender: profile.gender!,
      type: appointmentType,
      donationBlockId: timeBlockId.toString(),
    });

    return { appointment: response };
  }
}
