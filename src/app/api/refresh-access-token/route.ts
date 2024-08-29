import { NextApiRequest } from "next";

import { generateAccessToken } from "@/lib/generateTokens";
import { createApiResponse } from "@/lib/api-response";
import { headers } from "next/headers";
import { STATUS_CODES } from "@/lib/constants";
import { verifyJWT } from "@/helpers/jwt-verify";

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json();
    const headersPayload = headers();
    const token = headersPayload.get("authorization")?.split(" ")[1] ?? "";

    await verifyJWT(token, process.env.REFRESH_TOKEN_SECRET ?? "");

    const newAccessToken = generateAccessToken(identifier);
    return createApiResponse(
      true,
      STATUS_CODES.OK,
      "Generated new access token.",
      {
        accessToken: newAccessToken,
      }
    );
  } catch (error) {
    return createApiResponse(
      false,
      STATUS_CODES.UNAUTHORIZED,
      "Please login again for access."
    );
  }
}
