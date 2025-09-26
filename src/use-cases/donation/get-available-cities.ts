import { City } from "@/types/externalAPIs/fpsh";
import { AppointmentType, FpshGateway } from "@/ports/fpsh-gateway";

interface GetAvailableCitiesUseCaseRequest {
  appointmentType: AppointmentType;
}

interface GetAvailableCitiesUseCaseResponse {
  cities: City[];
}

export class GetAvailableCitiesUseCase {
  constructor(private fpshGateway: FpshGateway) {}

  async execute(
    request: GetAvailableCitiesUseCaseRequest
  ): Promise<GetAvailableCitiesUseCaseResponse> {
    const { appointmentType } = request;

    const response = await this.fpshGateway.getAvailableCities(appointmentType);

    const cities = response.data;

    return { cities };
  }
}
