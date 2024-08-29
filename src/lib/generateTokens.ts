import jwt from "jsonwebtoken";

export function generateAccessToken(phoneNumber: Number): string {
  return jwt.sign({ phoneNumber }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
}

export function generateRefreshToken(): string {
  return jwt.sign({}, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
}
