import { NextApiRequest } from "next";

import jwt from "jsonwebtoken";
import { generateAccessToken } from "@/lib/generateTokens";
import { createApiResponse } from "@/lib/api-response";
import { headers } from "next/headers";

export async function GET(req: NextApiRequest) {
  try {
    console.log(
      "APIIIIIIIIIIIIIIIIIIIIII",
      req.headers,
      Object.keys(req.headers)
    );
    const headersList = headers();
    const token = headersList.get("authorization")?.split(" ")[1] ?? "";
    // const token = (req.headers.authorization || "").split("Bearer").at(1) || "";
    console.log(token, "APIIIIIIIIII");
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);

    const newAccessToken = generateAccessToken();
    return createApiResponse(true, 200, "Generated new access token.", {
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.log(error);
    return createApiResponse(false, 401, "Please login again for access.");
  }
}
