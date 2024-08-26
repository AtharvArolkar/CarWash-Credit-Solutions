import { NextApiRequest } from "next";

import jwt from "jsonwebtoken";
import { generateAccessToken } from "@/lib/generateTokens";

export async function POST(req: NextApiRequest) {
  try {
    const token = (req.headers.authorization || "").split("Bearer").at(1) || "";
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);

    const newAccessToken = generateAccessToken();
    return createApiResponse(
      true,
      STATUS_CODES.OK,
      "Generated new access token.",
      { accessToken: newAccessToken }
    );
  } catch (error) {
    return createApiResponse(
      false,
      STATUS_CODES.UNAUTHORIZED,
      "Please login again for access."
    );
  }
}
