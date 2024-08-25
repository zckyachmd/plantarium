import { z } from "@hono/zod-openapi";

/**
 * Defines the schema for the error response.
 */
export const errorResponseSchema = z.object({
  errorCode: z.string().openapi({
    description: "An error code representing the type of error.",
  }),
  message: z.string().openapi({
    description: "A descriptive message about the error.",
  }),
  details: z.array(z.string()).optional().openapi({
    description: "Detailed information about the errors in the request.",
  }),
});
