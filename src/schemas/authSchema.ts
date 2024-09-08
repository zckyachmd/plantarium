import { z } from "@hono/zod-openapi";

export const login = z
  .object({
    username: z.string().openapi({
      description: "The username of the user.",
      example: "admin",
    }),
    password: z.string().openapi({
      description: "The password of the user.",
      example: "admin",
    }),
  })
  .openapi("login");
