// Configuring dotenv + failing fast when required secrets are missing
import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
  "DB_URL",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
];

const missing = requiredEnvVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variable(s): ${missing.join(", ")}. ` +
      "Refusing to start — check your .env file."
  );
}

for (const key of ["ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET"]) {
  if (process.env[key].length < 32) {
    throw new Error(
      `${key} is too short. Use a long, random secret (32+ characters recommended).`
    );
  }
}

if (process.env.ACCESS_TOKEN_SECRET === process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must differ.");
}
