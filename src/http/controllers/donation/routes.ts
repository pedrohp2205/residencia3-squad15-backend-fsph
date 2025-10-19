import { FastifyInstance } from "fastify";
import { GetAvailableCities } from "./get-available-cities";
import { verifyJwt } from "@/http/middlewares/verify-jwt";
import { GetDonorAppointments } from "./get-donor-appointments";
import { GetDonorProfile } from "./get-donor-profile";

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
}
