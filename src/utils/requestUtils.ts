import { z } from "zod";
import { errorResponse } from "./responseUtils";
import { formatZodError } from "./zodErrorUtils";
import { handlePrismaError } from "../utils/prismaUtils";
import { Context } from "hono";

/**
 * Handles an incoming request by validating its body against a provided schema.
 * If the validation fails, it returns a JSON error response with a 400 status code.
 * If the validation succeeds, it calls the provided callback function with the validated data.
 * If the callback function throws an error, it catches the error and returns a JSON error response with a corresponding status code.
 *
 * @param {Context} c - The context of the incoming request.
 * @param {z.Schema<T>} schema - The schema to validate the request body against.
 * @param {any} body - The body of the incoming request.
 * @param {(body: T) => Promise<any>} callback - The callback function to call with the validated data.
 * @return {Promise<any>} A promise that resolves to the result of the callback function or a JSON error response.
 */
const handleRequest = async <T>(
  c: Context,
  schema: z.Schema<T>,
  body: any,
  callback: (body: T) => Promise<any>
): Promise<any> => {
  const validation = schema.safeParse(body);
  if (!validation.success) {
    return c.json(
      errorResponse("Invalid input", formatZodError(validation.error, body)),
      { status: 400 }
    );
  }
  try {
    return await callback(validation.data);
  } catch (error) {
    const {
      error: errorMessage,
      details,
      errorCode,
    } = handlePrismaError(error);
    return c.json(errorResponse(errorMessage, details), { status: errorCode });
  }
};

export default handleRequest;
