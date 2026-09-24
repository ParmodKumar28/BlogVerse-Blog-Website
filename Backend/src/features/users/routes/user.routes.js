// User routes
import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshSession,
  updateProfile,
} from "../controller/user.controller.js";
import verifyToken from "../../../middlewares/auth.js";
import upload from "../../../middlewares/multer.middleware.js";
import { authLimiter } from "../../../middlewares/rateLimiter.js";

const router = express.Router();

// Auth routes
router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshSession);

// Session restore — called on app load to hydrate Redux from the httpOnly cookie
router.get("/me", verifyToken, getCurrentUser);

// Profile update — supports optional file upload for profile picture
router.put("/profile", verifyToken, upload.single("profileImage"), updateProfile);

export default router;
