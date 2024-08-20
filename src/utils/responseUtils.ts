type ResponseStatus = 'success' | 'error';

type ResponseData<T> = {
  status: ResponseStatus;
  message: string;
  data?: T;
  details?: string;
};

/**
 * Creates a response object with the specified status, message, optional data, and optional details.
 *
 * @param {ResponseStatus} status - The status of the response.
 * @param {string} message - The message to be included in the response.
 * @param {T} [data] - Optional data to be included in the response.
 * @param {string} [details] - Optional details to be included in the response.
 * @return {ResponseData<T>} The created response object.
 */
export function createResponse<T>(
  status: ResponseStatus,
  message: string,
  data?: T,
  details?: string
): ResponseData<T> {
  return {
    status,
    message,
    ...(data && { data }),
    ...(details && { details }),
  };
}

/**
 * Creates a successful response object.
 *
 * @param {string} message - The message to be included in the response.
 * @param {T} [data] - Optional data to be included in the response.
 * @returns {ResponseData<T>} A response object with a 'success' status.
 */
export function successResponse<T>(message: string, data?: T): ResponseData<T> {
  return createResponse('success', message, data);
}

/**
 * Creates an error response object.
 *
 * @param {string} message - The message to be included in the error response.
 * @param {string} [details] - Optional details to be included in the error response.
 * @returns {ResponseData<undefined>} An error response object with a 'error' status.
 */
export function errorResponse(
  message: string,
  details?: string
): ResponseData<undefined> {
  return createResponse('error', message, undefined, details);
}