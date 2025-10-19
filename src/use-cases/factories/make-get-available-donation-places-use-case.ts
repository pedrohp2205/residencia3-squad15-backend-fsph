import { AxiosFpshGateway } from "@/http/axios-fpsh-gateway";
import { GetAvailableDonationPlacesUseCase } from "../donation/get-available-donation-places";

export function makeGetAvailableDonationPlacesUseCase() {
  const fpshGateway = new AxiosFpshGateway();

  const getAvailableDonationPlacesUseCase = new GetAvailableDonationPlacesUseCase(fpshGateway);

  return getAvailableDonationPlacesUseCase;
}
