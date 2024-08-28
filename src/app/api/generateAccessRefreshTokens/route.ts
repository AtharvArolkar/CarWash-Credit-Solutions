import { NextApiRequest } from "next";

import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/generateTokens";
import { createApiResponse } from "@/lib/api-response";

export async function GET(req: Request) {
  try {
    const accessToken = generateAccessToken();
    const refreshToken = generateRefreshToken();
    return createApiResponse(true, 201, "New session", {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return createApiResponse(false, 401, "Please login again for access.");
  }
}
