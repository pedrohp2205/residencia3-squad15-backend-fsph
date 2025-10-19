import { AppointmentType, FpshGateway } from "@/ports/fpsh-gateway";
import { UsersRepository } from "@/repositories/users-repository";
import { UserNotFoundError } from "../errors/user-not-found-error";
import { DonationPlace } from "@/types/externalAPIs/fpsh";

interface GetAvailableDonationPlacesUseCaseRequest {
    appointmentType: AppointmentType;
    cityId: bigint; 
}

interface GetAvailableDonationPlacesUseCaseResponse {
  places: DonationPlace[];
}

export class GetAvailableDonationPlacesUseCase {
  constructor(
    private fpshGateway: FpshGateway,
  ) {}

  async execute(
    request: GetAvailableDonationPlacesUseCaseRequest
  ): Promise<GetAvailableDonationPlacesUseCaseResponse> {
    const { appointmentType, cityId } = request;

    const places = await this.fpshGateway.getAvailableLocations({
        id_cidade: cityId,
        tipo_atendimento: appointmentType,
    });

    return { places };
  }
}

