import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  SOLT_ROUND:string;
  JWT_EXPIRES:string;
  SUPER_ADMIN_EMAIL:string;
  SUPER_ADMIN_PASSWORD:string;
  JWT_REFRSH_EXPIRES:string;
  GEMINI_API_KEY:string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = ["PORT", "DB_URL", "NODE_ENV","JWT_ACCESS_SECRET","JWT_REFRESH_SECRET","SOLT_ROUND","JWT_EXPIRES","SUPER_ADMIN_EMAIL","SUPER_ADMIN_PASSWORD","JWT_REFRSH_EXPIRES","GEMINI_API_KEY"];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    SOLT_ROUND: process.env.SOLT_ROUND as string,
    JWT_EXPIRES:process.env.JWT_EXPIRES as string,
    SUPER_ADMIN_EMAIL:process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD:process.env.SUPER_ADMIN_PASSWORD as string,
    JWT_REFRSH_EXPIRES:process.env.JWT_REFRSH_EXPIRES as string,
    GEMINI_API_KEY:process.env.GEMINI_API_KEY as string,
  };
};

export const envVars = loadEnvVariables();
