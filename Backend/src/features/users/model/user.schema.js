// User schema
// Imports
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    profileImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Model
const User = mongoose.model("User", userSchema);

// Exporting model
export default User;
