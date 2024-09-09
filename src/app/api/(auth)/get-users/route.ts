import { JWTVerifyResult } from "jose";
import { headers } from "next/headers";

import { verifyJWT } from "@/helpers/jwt-verify";
import { JWTPayloadObject, UserRole } from "@/types/user";
import { createApiResponse } from "@/lib/api-response";
import { STATUS_CODES } from "@/lib/constants";
import { Types } from "mongoose";
import UserModel from "@/models/user.model";
import dbConnect from "@/lib/db-connect";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/common";

export async function GET(req: Request) {
  await dbConnect();
  const headerPayload = headers();
  const token = headerPayload?.get("authorization")?.split(" ")[1] ?? "";
  let jwtPayload: JWTVerifyResult<JWTPayloadObject> | undefined = undefined;
  try {
    jwtPayload = await verifyJWT(token, process.env.ACCESS_TOKEN_SECRET!);
  } catch (error) {
    return createApiResponse({
      success: false,
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: "Please login again for access.",
    });
  }
  const userId = new Types.ObjectId(jwtPayload.payload.identifier);
  try {
    const user = await UserModel.findById({ _id: userId });
    if (!user) {
      throw new Error("User not found.");
    }
    if (user.role !== UserRole.admin) {
      throw new Error("You are not allowed to access this resource.");
    }
    const userList = await UserModel.find(
      {},
      { _id: 1, email: 1, phoneNumber: 1, role: 1, isVerified: 1, name: 1 }
    );

    return createApiResponse({
      success: true,
      statusCode: STATUS_CODES.OK,
      message: "OK",
      body: { users: userList },
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const errorResponse: ApiResponse = {
      success: false,
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: errorMessage || "Something went wrong.",
    };
    switch (errorMessage) {
      case "User not found.":
        errorResponse.statusCode = STATUS_CODES.NOT_FOUND;
        break;
      case "You are not allowed to access this resource.":
        errorResponse.statusCode = STATUS_CODES.FORBIDDEN;
        break;
    }
  }
}
