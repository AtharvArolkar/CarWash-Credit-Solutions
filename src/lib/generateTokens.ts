import jwt from "jsonwebtoken";

export function generateAccessToken(identifier: string): string {
  return jwt.sign({ identifier }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
}

export function generateRefreshToken(): string {
  return jwt.sign({}, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
}
