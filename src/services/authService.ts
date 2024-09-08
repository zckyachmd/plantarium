import { OpenAPIHono } from "@hono/zod-openapi";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import { SignJWT } from "jose";
import handleRequest from "../utils/requestUtils";
import * as authSchema from "../schemas/authSchema";
import * as authRoute from "../routes/authRoute";
import * as responseUtils from "../utils/responseUtils";
import { env } from "../utils/env";

const prisma = new PrismaClient();
const auth = new OpenAPIHono();

const secretKey = env.JWT_SECRET || "default-secret";
const expiresIn = env.JWT_EXPIRES_IN || "1h";
const secret = new TextEncoder().encode(secretKey);

const generateToken = async (userId: number) => {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
  return token;
};

auth.openapi(authRoute.login, async (c) => {
  const body = await c.req.json();

  return handleRequest(
    c,
    authSchema.login,
    body,
    async ({ username, password }) => {
      const user = await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          password: true,
        },
      });

      if (!user || !(await compare(password, user.password))) {
        return c.json(
          responseUtils.errorResponse("Invalid username or password"),
          401
        );
      }

      const token = await generateToken(user.id);

      return c.json(
        responseUtils.successResponse("Login successful", { token })
      );
    }
  );
});

export default auth;
