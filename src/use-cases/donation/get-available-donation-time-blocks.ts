import { AppointmentType, FpshGateway } from "@/ports/fpsh-gateway";
import { TimeBlock, TimeBlockDate } from "@/types/externalAPIs/fpsh";

interface GetAvailableDonationDonationTimeBlocksUseCaseRequest {
  appointmentType: AppointmentType;
  placeId: bigint;
  selectedDate?: Date;
}

interface GetAvailableDonationDonationTimeBlocksUseCaseResponse {
  timeBlocks: TimeBlock[] | TimeBlockDate[];
}

export class GetAvailableDonationDonationTimeBlocksUseCase {
  constructor(private fpshGateway: FpshGateway) {}

  async execute(
    request: GetAvailableDonationDonationTimeBlocksUseCaseRequest
  ): Promise<GetAvailableDonationDonationTimeBlocksUseCaseResponse> {
    const { appointmentType, placeId, selectedDate } = request;

    if (selectedDate) {
      const { timeBlocks } = await this.fpshGateway.getBlocksByDate({
        id_local: placeId,
        tipo_atendimento: appointmentType,
        dateSelected: selectedDate.toISOString().split("T")[0],
      });
      return { timeBlocks }; 
    } else {
      const { timeBlocks } = await this.fpshGateway.getAllBlocks({
        id_local: placeId,
        tipo_atendimento: appointmentType,
      });
      return { timeBlocks }; 
    }
  }
}
