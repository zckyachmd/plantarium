import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { errorResponseSchema } from "../schemas/errorSchema";
import * as authSchema from "../schemas/authSchema";

const API_TAGS = ["Authentication"];

export const login = createRoute({
  method: "post",
  path: "/login",
  summary: "Login",
  description: "Login to the application.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: authSchema.login,
        },
      },
    },
  },
  tags: API_TAGS,
  responses: {
    200: {
      description: "Login successful.",
      content: {
        "application/json": {
          schema: z.object({
            status: z.string().default("success"),
            message: z.string().default("Login successful"),
            data: z.object({
              token: z.string(),
            }),
          }),
        },
      },
    },
    400: {
      description:
        "Invalid request due to incorrect parameters or data format.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("INVALID_LOGIN"),
              message: z
                .string()
                .default("Invalid username or password. Please try again."),
            })
            .openapi("LoginInvalidRequestResponse"),
        },
      },
    },
    401: {
      description: "Unauthorized due to invalid username or password.",
      content: {
        "application/json": {
          schema: errorResponseSchema
            .extend({
              errorCode: z.string().default("INVALID_CREDENTIALS"),
              message: z.string().default("Invalid username or password."),
            })
            .openapi("LoginUnauthorizedResponse"),
        },
      },
    },
  },
});
