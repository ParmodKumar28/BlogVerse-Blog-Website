// User repository file to communicate with database
import ErrorHandler from "../../../utils/ErrorHandler.js";
import User from "./user.schema.js";

// Creating user in the database
export const createUser = async (userData) => {
  try {
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    throw new ErrorHandler(400, "Error creating user");
  }
};

// Finding user by email
export const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw new ErrorHandler(400, "Error finding user by email");
  }
};

// Get user by ID (used by /me endpoint)
export const getUserById = async (id) => {
  try {
    return await User.findById(id).select("-password");
  } catch (error) {
    throw new ErrorHandler(400, "Error fetching user");
  }
};

// Update user profile (username and/or profile image)
export const updateUserProfile = async (id, updateData) => {
  try {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
  } catch (error) {
    throw new ErrorHandler(400, "Error updating user profile");
  }
};

// Increment token version — invalidates all previously issued access/refresh tokens
export const revokeUserSessions = async (id) => {
  try {
    return await User.findByIdAndUpdate(id, { $inc: { tokenVersion: 1 } }, { new: true });
  } catch (error) {
    throw new ErrorHandler(500, "Error revoking sessions");
  }
};
