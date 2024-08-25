import { errorResponse } from "../utils/responseUtils";
import { formatZodError } from "../utils/zodErrorUtils";

/**
 * Generic function to validate query parameters against a provided schema.
 *
 * @param {any} c - The request context.
 * @param {any} schema - The Zod schema to validate against.
 * @param {string} errorMessage - The error message to display on validation failure.
 * @return {Promise<Response | null>} A JSON response with a 400 status if validation fails, or null if validation succeeds.
 */
export const validateQueryParams = async (
  c: any,
  schema: any,
  errorMessage: string
): Promise<Response | null> => {
  const queryParams = c.req.query();
  const queryValidation = schema.safeParse(queryParams);
  if (!queryValidation.success) {
    return c.json(
      errorResponse(
        errorMessage,
        formatZodError(queryValidation.error, queryParams)
      ),
      { status: 400 }
    );
  }
  return null;
};

/**
 * Generic function to validate an ID parameter against the provided schema.
 *
 * @param {any} c - The request context.
 * @param {any} schema - The Zod schema to validate against.
 * @param {string} errorMessage - The error message to display on validation failure.
 * @return {Promise<number | Response>} - The validated ID if successful, or an error response if not.
 */
export const validateIdParam = async (
  c: any,
  schema: any,
  errorMessage: string
): Promise<number | Response> => {
  const idParam = c.req.param("id");
  const id = Number(idParam);
  const idValidation = schema.safeParse(id);
  if (!idValidation.success) {
    return c.json(
      errorResponse(errorMessage, formatZodError(idValidation.error, idParam)),
      { status: 400 }
    );
  }
  return id;
};
