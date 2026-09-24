// Configuring dotenv + failing fast when required secrets are missing
import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = ["JWT_SECRET", "DB_URL"];

const missing = requiredEnvVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variable(s): ${missing.join(", ")}. ` +
      "Refusing to start — check your .env file."
  );
}

if (process.env.JWT_SECRET.length < 16) {
  throw new Error(
    "JWT_SECRET is too short. Use a long, random secret (32+ characters recommended)."
  );
}
