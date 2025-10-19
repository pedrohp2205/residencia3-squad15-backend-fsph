import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./infra/env";
import { usersRoutes } from "./http/controllers/users/routes";
import { authRoutes } from "./http/controllers/auth/routes";
import fastifyMultipart from "@fastify/multipart";
import { postsRoutes } from "./http/controllers/posts/routes";
import { appointmentsRoutes } from "./http/controllers/donation/routes";


import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

export const app = fastify();
const prefix = { prefix: "/api/v1" };


app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "FSPH-Hemose API",
      description: "API (users, auth, posts, donation)",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:3333", description: "Local" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        refreshCookie: { type: "apiKey", in: "cookie", name: "refreshToken" },
      },
    },
  },
});

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
  uiConfig: { docExpansion: "list", deepLinking: true },
  staticCSP: true,
  transformSpecificationClone: true,
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: { cookieName: "refreshToken", signed: false },
  sign: { expiresIn: "30m" },
});

app.register(fastifyCookie);

app.register(fastifyMultipart, {
  limits: { fileSize: 10 * 1024 * 1024, files: 1, fields: 10 },
  throwFileSizeLimit: true,
});

// Rotas
app.register(usersRoutes, prefix);
app.register(authRoutes, prefix);
app.register(postsRoutes, prefix);
app.register(appointmentsRoutes, prefix);

// Error handler
app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: "Validation error.", issues: error.format() });
  }
  if (env.NODE_ENV !== "production") console.error(error);
  return reply.status(500).send({ message: "Internal server error." });
});
