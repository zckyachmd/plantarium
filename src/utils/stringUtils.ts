/**
 * Converts a query string into a filter object.
 *
 * @param {string} queryString - The query string to parse.
 * @param {Object} options - Options for parsing the query string.
 * @param {boolean} options.ignoreQueryPrefix - Whether to ignore the '?' prefix in the query string.
 * @return {Object} The filter object.
 */
export function parseQuery(
  queryString: string,
  options: { ignoreQueryPrefix?: boolean } = {}
): Record<string, any> {
  const params: Record<string, any> = {};

  // Return an empty object if the query string is empty
  if (!queryString) {
    return params;
  }

  // Remove '?' prefix if ignoreQueryPrefix is true
  if (options.ignoreQueryPrefix && queryString.startsWith('?')) {
    queryString = queryString.slice(1);
  }

  // Split the query string into key-value pairs
  queryString.split('&').forEach((pair) => {
    const [key, value] = pair.split('=');
    const decodedKey = decodeURIComponent(key);
    const decodedValue = decodeURIComponent(value || '');

    // Handle special 'include' key to convert comma-separated values to an array
    if (decodedKey === 'include') {
      params[decodedKey] = decodedValue.split(',').map((v) => v.trim());
    } else {
      // Handle other keys
      if (decodedKey.includes('[')) {
        // Handle nested keys like "filter[name]"
        const keys = decodedKey.split(/\[|\]/).filter(Boolean);
        let current = params;

        keys.forEach((subKey, index) => {
          if (index === keys.length - 1) {
            current[subKey] = decodedValue;
          } else {
            current[subKey] = current[subKey] || {};
            current = current[subKey];
          }
        });
      } else {
        params[decodedKey] = decodedValue;
      }
    }
  });

  return params;
}

/**
 * Converts a string or array of strings into a normalized array of strings.
 *
 * @param {string|string[]|null|undefined} value - The input string or array of strings to be normalized.
 * @param {string} [delimiter=','] - The delimiter to use when splitting the input string.
 * @return {string[]} An array of strings, with each string trimmed of whitespace.
 */
export function parseStringArray(
  value: string | string[] | null | undefined,
  delimiter: string = ','
): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return value.split(delimiter).map((v) => v.trim());
}

/**
 * Converts a string to a boolean value.
 *
 * @param {string} value - The string to be converted to a boolean value.
 * @return {boolean} The boolean equivalent of the input string.
 */
export function toBoolean(value: string | null | undefined): boolean {
  if (!value) {
    return false;
  }

  const trueValues = new Set(['true', '1']);

  return trueValues.has(value.trim().toLowerCase());
}
