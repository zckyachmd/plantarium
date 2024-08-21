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
  });

  return params;
}

/**
 * Parses a nested include string and builds an include object for Prisma queries.
 *
 * @param {string} includes - Comma-separated nested include strings
 * @return {object} Prisma include object
 */
export function parseInclude(includes: string): any {
  const includeArray = includes.split(',').map((item) => item.trim());
  const includeObject: any = {};

  includeArray.forEach((include: string) => {
    const parts = include.split('.');

    let currentLevel = includeObject;

    parts.forEach((part: string, index: number) => {
      if (index === parts.length - 1) {
        currentLevel[part] = true;
      } else {
        if (!currentLevel[part] || typeof currentLevel[part] === 'boolean') {
          currentLevel[part] = {};
        }
        currentLevel = currentLevel[part];
      }
    });
  });

  const wrapWithInclude = (obj: any): any => {
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          obj[key] = { include: wrapWithInclude(obj[key]) };
        }
      }
    }
    return obj;
  };

  return wrapWithInclude(includeObject);
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
