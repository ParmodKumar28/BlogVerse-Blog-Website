// User controller — handles auth and profile management
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  getUserById,
  updateUserProfile,
} from "../model/user.repository.js";
import ErrorHandler from "../../../utils/ErrorHandler.js";

// Shared helper: strips sensitive fields from a user document
const sanitizeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  profileImage: user.profileImage || "",
  blogs: user.blogs,
  createdAt: user.createdAt,
});

const passError = (next, error, fallbackMessage) =>
  next(error instanceof ErrorHandler ? error : new ErrorHandler(500, fallbackMessage));

// POST /api/user/register
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(new ErrorHandler(400, "Enter username, email, and password properly!"));
    }

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return next(new ErrorHandler(400, "Username, email, and password must be valid strings"));
    }

    if (password.length < 8) {
      return next(new ErrorHandler(400, "Password must be at least 8 characters long"));
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return next(new ErrorHandler(400, "User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await createUser({ username: username.trim(), email: normalizedEmail, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return passError(next, error, "Something went wrong while registering");
  }
};

// POST /api/user/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler(400, "Please provide email and password"));
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return next(new ErrorHandler(400, "Email and password must be valid strings"));
    }

    const user = await findUserByEmail(email.toLowerCase().trim());
    if (!user) return next(new ErrorHandler(401, "Invalid credentials"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler(401, "Invalid credentials"));

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "7d",
    });

    res.json({ message: "Login successful", token, user: sanitizeUser(user) });
  } catch (error) {
    return passError(next, error, "Something went wrong while logging in");
  }
};

// GET /api/user/me  — restore session from authorization header
export const getCurrentUser = async (req, res, next) => {
  try {
    // req.user is already attached by verifyToken middleware
    const user = await getUserById(req.user._id);
    if (!user) return next(new ErrorHandler(404, "User not found"));

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return passError(next, error, "Something went wrong while fetching your profile");
  }
};

// PUT /api/user/profile  — update username and/or profile picture
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updateData = {};

    if (req.body.username && req.body.username.trim()) {
      const username = req.body.username.trim();
      if (username.length > 30) {
        return next(new ErrorHandler(400, "Username must be 30 characters or fewer"));
      }
      updateData.username = username;
    }

    // If a file was uploaded, store its relative path
    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    if (Object.keys(updateData).length === 0) {
      return next(new ErrorHandler(400, "No data provided to update"));
    }

    const updatedUser = await updateUserProfile(userId, updateData);
    res.json({ message: "Profile updated successfully", user: sanitizeUser(updatedUser) });
  } catch (error) {
    return passError(next, error, "Something went wrong while updating your profile");
  }
};

// POST /api/user/logout
export const logoutUser = async (req, res, next) => {
  try {
    res.json({ message: "Logout successful" });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
