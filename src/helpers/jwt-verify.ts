import * as jose from "jose";

export const verifyJWT = async (
  token: string,
  tokenSecret: string
): Promise<jose.JWTVerifyResult<jose.JWTPayload>> => {
  try {
    return await jose.jwtVerify(
      token,
      new TextEncoder().encode(tokenSecret),
      {}
    );
  } catch (error) {
    console.log(error, "ERRORRR");
    throw error;
  }
};
