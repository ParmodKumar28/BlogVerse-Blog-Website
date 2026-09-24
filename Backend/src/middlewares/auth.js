// Middleware to verify the access-token cookie and attach the user to req
import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../features/users/model/user.schema.js";
import { verifyAccessToken, ACCESS_COOKIE } from "../utils/token.util.js";

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.[ACCESS_COOKIE];

  if (!token) {
    return next(
      new ErrorHandler(401, "Authorization denied. No token provided")
    );
  }

  try {
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return next(new ErrorHandler(401, "Session expired. Please log in again"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ErrorHandler(401, "Invalid token"));
  }
};

// Exporting middleware
export default verifyToken;
