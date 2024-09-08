import { Context } from "hono";
import { jwtVerify } from "jose";
import * as responseUtils from "../utils/responseUtils";
import { env } from "../utils/env";

const secret = new TextEncoder().encode(env.JWT_SECRET);

const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    return payload as { userId: number };
  } catch (error) {
    throw new Error("Invalid token");
  }
};

const authMiddleware = async (c: Context, next: () => Promise<void>) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  console.log(token);
  if (!token) {
    return c.json(responseUtils.errorResponse("No token provided"), {
      status: 401,
    });
  }

  try {
    const { userId } = await verifyToken(token);
    c.env.userId = userId;

    const response = await next();
    return response;
  } catch (error) {
    return c.json(responseUtils.errorResponse("Invalid token"), {
      status: 401,
    });
  }
};

export default authMiddleware;
