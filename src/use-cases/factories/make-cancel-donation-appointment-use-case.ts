import { CancelDonationAppointmentUseCase } from "../donation/cancel-donation-appointment"
import { FpshGateway } from "@/ports/fpsh-gateway"
import { AxiosFpshGateway } from "@/http/axios-fpsh-gateway"

export function makeCancelDonationAppointmentUseCase() {
  const fpshGateway = new AxiosFpshGateway()
  return new CancelDonationAppointmentUseCase(fpshGateway)
}
