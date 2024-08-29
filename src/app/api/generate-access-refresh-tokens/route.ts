import {
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/generateTokens";
import { createApiResponse } from "@/lib/api-response";
import { STATUS_CODES } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json();
    const accessToken = generateAccessToken(identifier);
    const refreshToken = generateRefreshToken();
    return createApiResponse(true, STATUS_CODES.CREATED, "New session", {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return createApiResponse(
      false,
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      "Something went wrong. Please try again."
    );
  }
}
