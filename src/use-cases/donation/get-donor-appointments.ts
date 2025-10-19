import { FpshGateway } from "@/ports/fpsh-gateway";
import { UsersRepository } from "@/repositories/users-repository";
import { UserNotFoundError } from "../errors/user-not-found-error";

interface GetDonorAppointmentsUseCaseRequest {
  userId: string;
}

interface GetDonorAppointmentsUseCaseResponse {
  appointments: any;
}

export class GetDonorAppointmentsUseCase {
  constructor(
    private fpshGateway: FpshGateway,
    private usersRepository: UsersRepository
  ) {}

  async execute(
    request: GetDonorAppointmentsUseCaseRequest
  ): Promise<GetDonorAppointmentsUseCaseResponse> {
    const { userId } = request;

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const response = await this.fpshGateway.getDonorAppointments(user.cpf);


    return { appointments: response };
  }
}
