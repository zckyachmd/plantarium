import { ZodError } from "zod";

/**
 * Formats a Zod error into a human-readable string.
 *
 * @param {ZodError} error - The Zod error to format.
 * @param {any} [currentValue] - The current value that caused the error (optional).
 * @return {string} A formatted string describing the error.
 */
export const formatZodError = (error: ZodError, currentValue?: any): string => {
  const errors = error.errors.map((err) => {
    const path = err.path.join(".");
    return `Path: ${path}, Error: ${err.message}`;
  });

  const formattedErrors = errors.join("; ");

  return currentValue
    ? `${formattedErrors} (Current value: ${JSON.stringify(currentValue)})`
    : formattedErrors;
};
