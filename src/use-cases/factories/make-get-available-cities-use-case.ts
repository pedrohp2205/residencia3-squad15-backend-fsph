import { AxiosFpshGateway } from "@/http/axios-fpsh-gateway";
import { GetAvailableCitiesUseCase } from "../appointments/get-available-cities";

export function makeGetAvailableCitiesUseCase() {
  const fpshGateway = new AxiosFpshGateway();

  const getAvailableCitiesUseCase = new GetAvailableCitiesUseCase(fpshGateway);

  return getAvailableCitiesUseCase;
}
