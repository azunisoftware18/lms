import dotenv from "dotenv";

dotenv.config();

const ENV = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as
    | `${number}${"s" | "m" | "h" | "d"}`
    | number,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as
    | `${number}${"s" | "m" | "h" | "d"}`
    | number,
  CREDIT_PROVIDER: process.env.CREDIT_PROVIDER,
  VERIFICATION_BASE_URL: process.env.VERIFICATION_BASE_URL,
  VERIFICATION_API_KEY: process.env.VERIFICATION_API_KEY,
  CIBIL_API: process.env.CIBIL_API,
  CIBIL_API_KEY: process.env.CIBIL_API_KEY,
 
};

export default ENV;