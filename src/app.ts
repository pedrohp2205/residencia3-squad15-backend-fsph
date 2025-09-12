import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./infra/env";
import { usersRoutes } from "./http/controllers/users/routes";
import { authRoutes } from "./http/controllers/auth/routes";
import fastifyMultipart from "@fastify/multipart";
import { postsRoutes } from "./http/controllers/posts/routes";

export const app = fastify();
const prefix = { prefix: "/api/v1" };

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "30m",
  },
});

app.register(fastifyCookie);

app.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
    fields: 10,
  },
  throwFileSizeLimit: true,
  // attachFieldsToBody: true,
});

app.register(usersRoutes, prefix);
app.register(authRoutes, prefix);
app.register(postsRoutes, prefix);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "Internal server error." });
});
