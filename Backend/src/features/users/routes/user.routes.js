// User routes
import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateProfile,
} from "../controller/user.controller.js";
import verifyToken from "../../../middlewares/auth.js";
import upload from "../../../middlewares/multer.middleware.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Session restore — called on app load to hydrate Redux using JWT token from Authorization header
router.get("/me", verifyToken, getCurrentUser);

// Profile update — supports optional file upload for profile picture
router.put("/profile", verifyToken, upload.single("profileImage"), updateProfile);

export default router;
