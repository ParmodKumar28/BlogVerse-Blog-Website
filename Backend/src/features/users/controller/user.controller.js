// User controller — handles auth and profile management
import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  getUserById,
  updateUserProfile,
  revokeUserSessions,
} from "../model/user.repository.js";
import ErrorHandler from "../../../utils/ErrorHandler.js";
import {
  setAuthCookies,
  clearAuthCookies,
  verifyAccessToken,
  verifyRefreshToken,
  ACCESS_COOKIE,
  REFRESH_COOKIE,
} from "../../../utils/token.util.js";

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

    setAuthCookies(res, user);

    res.json({ message: "Login successful", user: sanitizeUser(user) });
  } catch (error) {
    return passError(next, error, "Something went wrong while logging in");
  }
};

// GET /api/user/me  — return current user from verified access-token cookie
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

// POST /api/user/refresh — mint a fresh access token from the refresh cookie
export const refreshSession = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    if (!refreshToken) {
      return next(new ErrorHandler(401, "No refresh token provided"));
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      clearAuthCookies(res);
      return next(new ErrorHandler(401, "Invalid refresh token"));
    }

    const user = await getUserById(decoded.userId);
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      clearAuthCookies(res);
      return next(new ErrorHandler(401, "Session expired. Please log in again"));
    }

    // Rotate both tokens so a leaked refresh cookie has a short lifespan
    setAuthCookies(res, user);
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return passError(next, error, "Something went wrong while refreshing session");
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

// POST /api/user/logout — revoke all tokens for the user and clear cookies
export const logoutUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.[ACCESS_COOKIE];
    const refreshToken = req.cookies?.[REFRESH_COOKIE];

    // Best-effort: resolve the user from whichever token is still valid and
    // bump their tokenVersion so all outstanding access/refresh tokens die.
    let userId = null;
    try {
      if (accessToken) userId = verifyAccessToken(accessToken).userId;
    } catch {
      /* access token expired/invalid — fall through to refresh token */
    }
    try {
      if (!userId && refreshToken) userId = verifyRefreshToken(refreshToken).userId;
    } catch {
      /* refresh token invalid — nothing to revoke */
    }

    if (userId) await revokeUserSessions(userId);

    clearAuthCookies(res);
    res.json({ message: "Logout successful" });
  } catch (error) {
    return passError(next, error, "Something went wrong while logging out");
  }
};
