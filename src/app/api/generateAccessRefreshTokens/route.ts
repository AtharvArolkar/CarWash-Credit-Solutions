import { NextApiRequest } from "next";

import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/generateTokens";

export async function POST(req: NextApiRequest) {
  try {
    const accessToken = generateAccessToken();
    const refreshToken = generateRefreshToken();
    return createApiResponse(true, STATUS_CODES.OK, "New session", {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return createApiResponse(
      false,
      STATUS_CODES.UNAUTHORIZED,
      "Please login again for access."
    );
  }
}
