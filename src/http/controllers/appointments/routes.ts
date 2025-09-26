import { FastifyInstance } from "fastify";
import { GetAvailableCities } from "./get-available-cities";

export async function appointmentsRoutes(app: FastifyInstance) {
  app.get("/appointments/cities", GetAvailableCities);
}
