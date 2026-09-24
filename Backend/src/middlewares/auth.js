// Middleware to verify token
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../features/users/model/user.schema.js";

const verifyToken = async (req, res, next) => {
  // Get token strictly from Authorization header
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Check if token exists
  if (!token) {
    return next(
      new ErrorHandler(401, "Authorization denied. No token provided")
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // Retrieve user from the database using the decoded user ID
    const user = await User.findById(decoded.userId); // Assuming userId is the field in the token

    // Check if user exists
    if (!user) {
      return next(new ErrorHandler(401, "User not found"));
    }

    // Attach the user object to the request
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    next(new ErrorHandler(401, "Invalid token"));
  }
};

// Exporting middleware
export default verifyToken;
