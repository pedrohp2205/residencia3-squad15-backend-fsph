import { AxiosFpshGateway } from "@/http/axios-fpsh-gateway";
import { GetAvailableDonationDonationTimeBlocksUseCase } from "../donation/get-available-donation-time-blocks";


export function makeGetAvailableDonationTimeBlocksUseCase() {
  const fpshGateway = new AxiosFpshGateway();

  const getAvailableDonationTimeBlocksUseCase = new GetAvailableDonationDonationTimeBlocksUseCase(fpshGateway);

  return getAvailableDonationTimeBlocksUseCase;
}
