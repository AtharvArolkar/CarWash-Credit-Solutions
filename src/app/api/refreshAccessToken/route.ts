import { NextApiRequest } from "next";

import { generateAccessToken } from "@/lib/generateTokens";
import { createApiResponse } from "@/lib/api-response";
import { headers } from "next/headers";
import * as jose from "jose";
import { STATUS_CODES } from "@/lib/constants";

export async function GET(req: NextApiRequest) {
  try {
    const headersList = headers();
    const token = headersList.get("authorization")?.split(" ")[1] ?? "";
    await jose.jwtVerify(
      token ?? "",
      new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET),
      {}
    );

    const newAccessToken = generateAccessToken();
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
