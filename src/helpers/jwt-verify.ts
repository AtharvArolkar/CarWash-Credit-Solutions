import { JWTPayloadObject } from "@/types/user";
import * as jose from "jose";

export const verifyJWT = async (
  token: string,
  tokenSecret: string
): Promise<jose.JWTVerifyResult<JWTPayloadObject>> => {
  try {
    return await jose.jwtVerify(
      token,
      new TextEncoder().encode(tokenSecret),
      {}
    );
  } catch (error) {
    throw error;
  }
};
