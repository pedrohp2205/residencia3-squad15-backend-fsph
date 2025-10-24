import { FastifyInstance } from "fastify";
import { GetAvailableCities } from "./get-available-cities";
import { verifyJwt } from "@/http/middlewares/verify-jwt";
import { GetDonorAppointments } from "./get-donor-appointments";
import { GetDonorProfile } from "./get-donor-profile";
import { GetAvailableDonationPlaces } from "./get-available-donation-places";
import { GetAvailableDonationTimeBlocks } from "./get-available-donation-time-blocks";
import { MakeDonationAppointment } from "./make-donation-appointment";

export async function appointmentsRoutes(app: FastifyInstance) {
  app.get(
    "/donation/appointments/cities",
    { onRequest: [verifyJwt] },
    GetAvailableCities
  );

  app.get(
    "/donation/appointments",
    { onRequest: [verifyJwt] },
    GetDonorAppointments
  );

  app.get(
    "/donation/profile",
    { onRequest: [verifyJwt] },
    GetDonorProfile
  );

  app.get(
    "/donation/appointments/places",
    { onRequest: [verifyJwt] },
    GetAvailableDonationPlaces
  );

  app.get(
    "/donation/appointments/time-blocks",
    { onRequest: [verifyJwt] },
    GetAvailableDonationTimeBlocks
  );

  app.post(
    "/donation/appointments",
    { onRequest: [verifyJwt] },
    MakeDonationAppointment
  );
}
