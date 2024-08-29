import { NextApiRequest } from "next";

import { generateAccessToken } from "@/lib/generateTokens";
import { createApiResponse } from "@/lib/api-response";
import { headers } from "next/headers";
import { STATUS_CODES } from "@/lib/constants";
import { verifyJWT } from "@/helpers/jwt-verify";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    if (!payload.identifier) {
      return createApiResponse({
        success: false,
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: "Incorrect payload",
      });
    }
    const headersPayload = headers();
    const token = headersPayload.get("authorization")?.split(" ")[1] ?? "";
    await verifyJWT(token, process.env.REFRESH_TOKEN_SECRET ?? "");

    const newAccessToken = generateAccessToken("identifier");
    return createApiResponse({
      success: true,
      statusCode: STATUS_CODES.OK,
      message: "Generated new access token.",
      body: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    return createApiResponse({
      success: false,
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: "Please login again for access.",
    });
  }
}
