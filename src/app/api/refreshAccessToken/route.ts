import { NextApiRequest } from "next";

import jwt from "jsonwebtoken";
import { generateAccessToken } from "@/lib/generateTokens";
import { createApiResponse } from "@/lib/api-response";
import { headers } from "next/headers";
import * as jose from "jose";

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
    return createApiResponse(true, 200, "Generated new access token.", {
      accessToken: newAccessToken,
    });
  } catch (error) {
    return createApiResponse(false, 401, "Please login again for access.");
  }
}
