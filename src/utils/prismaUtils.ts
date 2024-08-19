import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

interface PrismaErrorResponse {
  error: string;
  details?: string;
  errorCode: number;
}

/**
 * Handles Prisma errors and returns a structured error response.
 *
 * @param {any} error - The error object from Prisma or any other source.
 * @return {PrismaErrorResponse} An object containing the error message, optional details, and the corresponding HTTP status code.
 */
export function handlePrismaError(error: any): PrismaErrorResponse {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2000':
        return {
          error: 'The value provided is too long for a database column.',
          details: error.message,
          errorCode: 400,
        };
      case 'P2001':
        return {
          error: 'No record found to update.',
          details: error.message,
          errorCode: 404,
        };
      case 'P2002':
        return {
          error: 'A record with this unique field already exists.',
          details: error.message,
          errorCode: 409,
        };
      case 'P2003':
        return {
          error:
            'Foreign key constraint failed. Ensure the related record exists.',
          details: error.message,
          errorCode: 409,
        };
      case 'P2016':
        return {
          error: 'No record found for the given criteria.',
          details: error.message,
          errorCode: 404,
        };
      case 'P2025':
        return {
          error: 'The specified record could not be found.',
          details: error.message,
          errorCode: 404,
        };
      case 'P2026':
        return {
          error: 'Failed to create the record. Check the provided data.',
          details: error.message,
          errorCode: 400,
        };
      case 'P2027':
        return {
          error:
            'Failed to update the record. Ensure the record exists and data is valid.',
          details: error.message,
          errorCode: 400,
        };
      default:
        return {
          error: 'A database error occurred.',
          details: error.message,
          errorCode: 500,
        };
    }
  }

  // Handle general or unknown errors
  return {
    error: 'An unknown error occurred.',
    details: error.message,
    errorCode: 500,
  };
}

/**
 * Builds query options for Prisma based on filtering, sorting, and including related data.
 *
 * @param {Record<string, any>} filters - Additional filters to apply to the query. Defaults to an empty object.
 * @param {Record<string, 'asc' | 'desc'>} sort - Sorting options for the query. Defaults to an empty object.
 * @param {string[]} include - List of related data to include in the response. Defaults to an empty array.
 * @return {Object} The query options including where, orderBy, and include.
 */
export function buildQueryOptions(
  filters: Record<string, any> = {},
  sort: Record<string, 'asc' | 'desc'> = {},
  include: string[] = []
): { where: any; orderBy: any[]; include: any } {
  const whereConditions: any = {};
  const orderConditions: any[] = [];

  // Handle filtering
  if (filters && Object.keys(filters).length > 0) {
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value) {
        const values = value
          .split(',')
          .map((v: string) => v.trim().toLowerCase());
        whereConditions[key] = {
          in: values,
          mode: 'insensitive',
        };
      }
    });
  }

  // Handle sorting
  if (sort && Object.keys(sort).length > 0) {
    Object.keys(sort).forEach((key) => {
      const direction = sort[key] === 'desc' ? 'desc' : 'asc';
      orderConditions.push({ [key]: direction });
    });
  }

  // Handle include
  const includeConditions: any = {};
  if (include.length > 0) {
    include.forEach((relation) => {
      includeConditions[relation] = true;
    });
  }

  return {
    where:
      Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
    orderBy: orderConditions.length > 0 ? orderConditions : [],
    include: includeConditions,
  };
}
