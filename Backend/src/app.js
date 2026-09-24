// This is the main file here iam creating server instanace and routing and middleware applied
// Dotenv at the top for configuring
import "./dotenv.js";

// Imports
import express from "express";
import path from "path";
import { ErrorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

// Routers imports
import userRouter from "../src/features/users/routes/user.routes.js";
import blogRouter from "../src/features/blogs/routes/blog.routes.js";

// Creating server
const app = express();

app.set("trust proxy", 1);

// Setting up cors
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8000",
  process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : null,
  // Add explicit Netlify deployment URLs here instead of relying on a weak substring check
  process.env.NETLIFY_URL ? process.env.NETLIFY_URL.replace(/\/$/, "") : null,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      // Removed unsafe "!origin.includes('malicious')" check — replaced with strict whitelist match
      const isAllowed = allowedOrigins.includes(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (cookies/headers)
  }),
);

// Security headers middleware (helps prevent common attacks like XSS, clickjacking, etc.)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Request logging middleware (helps in debugging and monitoring requests)
app.use(morgan("dev"));

// Basic rate limiting to prevent brute-force / DDoS style abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
});
app.use(apiLimiter);

// Serve uploaded profile images as static files
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

// Body parsing
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16kb" }));

app.use(mongoSanitize());

// Cookie parser
app.use(cookieParser());

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Blogverse API :)");
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);

// Handling invalid routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Invalid api! Enter valid api here please",
  });
});

// Error handler middleware
app.use(ErrorHandlerMiddleware);

// Exporting server
export default app;
