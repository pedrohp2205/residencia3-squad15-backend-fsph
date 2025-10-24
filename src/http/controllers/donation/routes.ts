import { FastifyInstance } from "fastify";
import { GetAvailableCities } from "./get-available-cities";
import { verifyJwt } from "@/http/middlewares/verify-jwt";
import { GetDonorAppointments } from "./get-donor-appointments";
import { GetDonorProfile } from "./get-donor-profile";
import { GetAvailableDonationPlaces } from "./get-available-donation-places";
import { GetAvailableDonationTimeBlocks } from "./get-available-donation-time-blocks";
import { MakeDonationAppointment } from "./make-donation-appointment";
import { MakeCampaignDonationAppointment } from "./make-donation-campaign-appointment";

export async function appointmentsRoutes(app: FastifyInstance) {
  // GET /donation/appointments/cities
  app.get(
    "/donation/appointments/cities",
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ["Appointments"],
        summary: "Listar cidades disponíveis",
        description: "Retorna a lista de cidades com disponibilidade para agendamento.",
        querystring: {
          type: "object",
          required: ["appointmentType"],
          additionalProperties: false,
          properties: {
            appointmentType: { type: "string", enum: ["D", "M", "C"] },
          },
        },
        response: {
          200: {
            type: "object",
            additionalProperties: false,
            properties: {
              cities: {
                type: "array",
                items: { type: "object", additionalProperties: false },
              },
            },
            required: ["cities"],
          },
          401: {
            type: "object",
            additionalProperties: false,
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
            required: ["statusCode", "error", "message"],
          },
          500: {
            type: "object",
            additionalProperties: false,
            properties: { message: { type: "string" } },
            required: ["message"],
          },
        },
      },
    },
    GetAvailableCities
  );

  // GET /donation/appointments
  app.get(
    "/donation/appointments",
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ["Appointments"],
        summary: "Listar agendamentos do doador",
        description: "Retorna os agendamentos do doador autenticado.",
        response: {
          200: {
            type: "object",
            additionalProperties: false,
            properties: {
              appointments: {
                type: "array",
                items: { type: "object", additionalProperties: false },
              },
            },
            required: ["appointments"],
          },
          401: {
            type: "object",
            additionalProperties: false,
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
            required: ["statusCode", "error", "message"],
          },
          500: {
            type: "object",
            additionalProperties: false,
            properties: { message: { type: "string" } },
            required: ["message"],
          },
        },
      },
    },
    GetDonorAppointments
  );

  // GET /donation/profile
  app.get(
    "/donation/profile",
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ["Appointments"],
        summary: "Obter perfil do doador",
        description: "Retorna o perfil do doador autenticado.",
        response: {
          200: {
            type: "object",
            additionalProperties: false,
            properties: {
              profile: { type: "object", additionalProperties: false },
            },
            required: ["profile"],
          },
          401: {
            type: "object",
            additionalProperties: false,
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
            required: ["statusCode", "error", "message"],
          },
          500: {
            type: "object",
            additionalProperties: false,
            properties: { message: { type: "string" } },
            required: ["message"],
          },
        },
      },
    },
    GetDonorProfile
  );

  // GET /donation/appointments/places
  app.get(
    "/donation/appointments/places",
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ["Appointments"],
        summary: "Listar locais de doação disponíveis",
        description: "Retorna os locais de doação disponíveis para a cidade e tipo de atendimento.",
        querystring: {
          type: "object",
          required: ["appointmentType", "cityId"],
          additionalProperties: false,
          properties: {
            appointmentType: { type: "string", enum: ["D", "M", "C"] },
            // cityId chega como string e é convertido para BigInt na lógica
            cityId: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            additionalProperties: false,
            properties: {
              places: {
                type: "array",
                items: { type: "object", additionalProperties: false },
              },
            },
            required: ["places"],
          },
          401: {
            type: "object",
            additionalProperties: false,
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
            required: ["statusCode", "error", "message"],
          },
          500: {
            type: "object",
            additionalProperties: false,
            properties: { message: { type: "string" } },
            required: ["message"],
          },
        },
      },
    },
    GetAvailableDonationPlaces
  );

  // GET /donation/appointments/time-blocks
  app.get(
    "/donation/appointments/time-blocks",
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ["Appointments"],
        summary: "Listar blocos de horários disponíveis",
        description:
          "Retorna os blocos de horários disponíveis para doação, podendo filtrar por data selecionada.",
        querystring: {
          type: "object",
          required: ["appointmentType", "placeId"],
          additionalProperties: false,
          properties: {
            appointmentType: { type: "string", enum: ["D", "M", "C"] },
            // selectedDate é opcional (string), transformada em Date na lógica
            selectedDate: { type: "string" },
            // placeId chega como string e é convertido para BigInt na lógica
            placeId: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            additionalProperties: false,
            properties: {
              timeBlocks: {
                type: "array",
                items: { type: "object", additionalProperties: false },
              },
            },
            required: ["timeBlocks"],
          },
          401: {
            type: "object",
            additionalProperties: false,
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
            required: ["statusCode", "error", "message"],
          },
          500: {
            type: "object",
            additionalProperties: false,
            properties: { message: { type: "string" } },
            required: ["message"],
          },
        },
      },
    },
    GetAvailableDonationTimeBlocks
  );

  // POST /donation/appointments
  app.post(
    "/donation/appointments",
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ["Appointments"],
        summary: "Agendar doação individual",
        description: "Cria um agendamento de doação para o doador autenticado.",
        body: {
          type: "object",
          required: [
            "appointmentType",
            "timeBlockId",
            "firstTimeDonating",
            "weightMoreThanFiftyKg",
            "wasTatooedInPlaceNotCertified",
          ],
          additionalProperties: false,
          properties: {
            appointmentType: { type: "string", enum: ["D", "M"] },
            // timeBlockId chega como string e é convertido para BigInt na lógica
            timeBlockId: { type: "string" },
            firstTimeDonating: { type: "boolean" },
            weightMoreThanFiftyKg: { type: "boolean" },
            wasTatooedInPlaceNotCertified: { type: "boolean" },
          },
        },
        response: {
          201: {
            type: "null",
            nullable: true,
          },
          401: {
            type: "object",
            additionalProperties: false,
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
            required: ["statusCode", "error", "message"],
          },
          500: {
            type: "object",
            additionalProperties: false,
            properties: { message: { type: "string" } },
            required: ["message"],
          },
        },
      },
    },
    MakeDonationAppointment
  );

  // POST /donation/appointments/campaign
  app.post(
    "/donation/appointments/campaign",
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ["Appointments"],
        summary: "Agendar campanha de doação",
        description:
          "Cria um agendamento de campanha de doação para o doador autenticado.",
        body: {
          type: "object",
          required: ["shift", "date", "amountOfDonors"],
          additionalProperties: false,
          properties: {
            shift: { type: "string", enum: ["morning", "afternoon"] },
            // date chega como string (ex.: YYYY-MM-DD) e é convertida para Date na lógica (z.coerce.date())
            date: { type: "string" },
            amountOfDonors: { type: "integer", minimum: 1 },
          },
        },
        response: {
          201: {
            type: "object",
            additionalProperties: false,
            properties: {
              appointment: { type: "object", additionalProperties: false },
            },
            required: ["appointment"],
          },
          400: {
            type: "object",
            additionalProperties: false,
            properties: {
              message: { type: "string" },
              issues: { type: "array", items: { type: "object", additionalProperties: false } },
            },
            required: ["message"],
          },
          401: {
            type: "object",
            additionalProperties: false,
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
            },
            required: ["statusCode", "error", "message"],
          },
          404: {
            type: "object",
            additionalProperties: false,
            properties: { message: { type: "string" } },
            required: ["message"],
          },
          500: {
            type: "object",
            additionalProperties: false,
            properties: { message: { type: "string" } },
            required: ["message"],
          },
        },
      },
    },
    MakeCampaignDonationAppointment
  );
}
