import { createApiResponse } from "@/lib/api-response";
import { STATUS_CODES } from "@/lib/constants";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/generateTokens";

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json();
    if (!identifier) {
      return createApiResponse({
        success: false,
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: "Incorrect payload",
      });
    }
    const accessToken = generateAccessToken(identifier);
    const refreshToken = generateRefreshToken();
    return createApiResponse({
      success: true,
      statusCode: STATUS_CODES.CREATED,
      message: "New session",
      body: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return createApiResponse({
      success: false,
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: "Something went wrong. Please try again.",
    });
  }
}
