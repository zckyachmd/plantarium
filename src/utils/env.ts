import { config } from "dotenv";

config();

interface EnvVariables {
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
  DB_PORT: string;
  DATABASE_URL: string;
}

const getEnv = (key: keyof EnvVariables): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

// Export the environment variables
export const env: EnvVariables = {
  DB_NAME: getEnv("DB_NAME"),
  DB_USER: getEnv("DB_USER"),
  DB_PASS: getEnv("DB_PASS"),
  DB_PORT: getEnv("DB_PORT"),
  DATABASE_URL: getEnv("DATABASE_URL"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN"),
};
