import { FpshGateway } from "@/ports/fpsh-gateway";

interface CancelDonationAppointmentUseCaseRequest {
  protocol: string;
}

interface CancelDonationAppointmentUseCaseResponse {
  success: boolean;
}

export class CancelDonationAppointmentUseCase {
  constructor(private fpshGateway: FpshGateway) {}

  async execute(
    request: CancelDonationAppointmentUseCaseRequest
  ): Promise<CancelDonationAppointmentUseCaseResponse> {
    const { protocol } = request;

    const success = await this.fpshGateway.cancelAppointment({ protocol });

    return { success };
  }
}
