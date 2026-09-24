import jwt from "jsonwebtoken";

const isProd = process.env.NODE_ENV === "production";

const ACCESS_TTL_MS =
  Number(process.env.ACCESS_TOKEN_TTL_MIN || 15) * 60 * 1000;
const REFRESH_TTL_MS =
  Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7) * 24 * 60 * 60 * 1000;

export const ACCESS_COOKIE = "accessToken";
export const REFRESH_COOKIE = "refreshToken";

// Shared cookie options. In production the frontend and API live on different
// sites (e.g. Netlify + Render), so cookies must be SameSite=None + Secure.
// Locally both run on localhost, so Lax works over http.
const baseCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
};

const buildPayload = (user) => ({
  userId: user._id.toString(),
  tokenVersion: user.tokenVersion,
});

export const generateAccessToken = (user) =>
  jwt.sign(buildPayload(user), process.env.ACCESS_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: Math.floor(ACCESS_TTL_MS / 1000),
  });

export const generateRefreshToken = (user) =>
  jwt.sign(buildPayload(user), process.env.REFRESH_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: Math.floor(REFRESH_TTL_MS / 1000),
  });

export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, { algorithms: ["HS256"] });

export const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, { algorithms: ["HS256"] });

// Issue fresh access + refresh cookies for a user (also used to rotate on refresh)
export const setAuthCookies = (res, user) => {
  res.cookie(ACCESS_COOKIE, generateAccessToken(user), {
    ...baseCookieOptions,
    maxAge: ACCESS_TTL_MS,
  });
  res.cookie(REFRESH_COOKIE, generateRefreshToken(user), {
    ...baseCookieOptions,
    path: "/api/user",
    maxAge: REFRESH_TTL_MS,
  });
};

export const clearAuthCookies = (res) => {
  res.clearCookie(ACCESS_COOKIE, baseCookieOptions);
  res.clearCookie(REFRESH_COOKIE, { ...baseCookieOptions, path: "/api/user" });
};
