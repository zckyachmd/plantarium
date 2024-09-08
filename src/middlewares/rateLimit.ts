import { Context } from "hono";

/**
 * Creates a rate limiter middleware that limits the number of requests from a single IP address within a given time window.
 *
 * @param {number} windowMs - The time window in milliseconds.
 * @param {number} maxRequests - The maximum number of requests allowed within the time window.
 * @return {function} A middleware function that checks the rate limit for each incoming request.
 */
const rateLimiter = (windowMs: number, maxRequests: number) => {
  const requestCounts = new Map<
    string,
    { count: number; firstRequestTime: number }
  >();

  return async (c: Context, next: () => Promise<void>) => {
    const ip = c.req.header("x-forwarded-for") || c.req.header("host");

    if (!ip) {
      return c.json({ message: "Unable to determine IP address" }, 400);
    }

    const now = Date.now();
    const requestData = requestCounts.get(ip);

    if (requestData) {
      if (now - requestData.firstRequestTime > windowMs) {
        requestCounts.set(ip, { count: 1, firstRequestTime: now });
      } else if (requestData.count >= maxRequests) {
        return c.json({ message: "Too many requests" }, 429);
      } else {
        requestCounts.set(ip, {
          count: requestData.count + 1,
          firstRequestTime: requestData.firstRequestTime,
        });
      }
    } else {
      requestCounts.set(ip, { count: 1, firstRequestTime: now });
    }

    await next();
  };
};

export default rateLimiter;
