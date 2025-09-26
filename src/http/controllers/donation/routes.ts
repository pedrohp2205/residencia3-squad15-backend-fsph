import { FastifyInstance } from "fastify";
import { GetAvailableCities } from "./get-available-cities";
import { verifyJwt } from "@/http/middlewares/verify-jwt";

export async function appointmentsRoutes(app: FastifyInstance) {
  app.get(
    "/appointments/cities",
    { onRequest: [verifyJwt] },
    GetAvailableCities
  );
}
