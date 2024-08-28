import jwt from "jsonwebtoken";

export function generateAccessToken() {
  console.log("Generate Access token");
  return jwt.sign({}, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
}

export function generateRefreshToken() {
  console.log("Generate Refresh token");
  return jwt.sign({}, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
}
