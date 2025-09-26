import { FpshGateway } from "@/ports/fpsh-gateway";

interface GetDonorProfileUseCaseRequest {
  userId: string;
}

interface GetDonorProfileUseCaseResponse {
  profile: any;
}

export class GetDonorProfileUseCase {
  constructor(private fpshGateway: FpshGateway) {}

  async execute(
    request: GetDonorProfileUseCaseRequest
  ): Promise<GetDonorProfileUseCaseResponse> {
    const { userId } = request;

    const response = await this.fpshGateway.getDonorProfile(userId);

    return { profile: response };
  }
}
