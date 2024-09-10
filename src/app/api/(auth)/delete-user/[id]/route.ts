import { JWTVerifyResult } from "jose";
import { Types } from "mongoose";
import { headers } from "next/headers";

import { verifyJWT } from "@/helpers/jwt-verify";
import { createApiResponse } from "@/lib/api-response";
import { STATUS_CODES } from "@/lib/constants";
import dbConnect from "@/lib/db-connect";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/common";
import { JWTPayloadObject, UserRole } from "@/types/user";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  await dbConnect();
  const requestPayload = headers();
  const token = requestPayload.get("authorization")?.split(" ")[1] ?? "";

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
  const userId = new Types.ObjectId(jwtPayload.payload.identifier ?? "");

  try {
    const user = await UserModel.findById({ _id: userId });
    if (!user) {
      throw new Error("User not found.");
    }
    if (user.role !== UserRole.admin) {
      throw new Error("You are not allowed to acces this resource.");
    }
    if (user._id === jwtPayload.payload.identifier) {
      throw new Error("You cannot delete your own user");
    }

    const deleteUserId = new Types.ObjectId(params.id);
    const deleteResponse = await UserModel.findByIdAndDelete({
      _id: deleteUserId,
    });
    if (!deleteResponse) {
      throw new Error("No user found to delete.");
    }

    return createApiResponse({
      success: true,
      statusCode: STATUS_CODES.OK,
      message: "User deleted successfully",
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
      case "No user found to delete.": {
        errorResponse.message = errorMessage;
        errorResponse.statusCode = STATUS_CODES.NOT_FOUND;
        break;
      }
      case "You are not allowed to acces this resource.":
      case "You cannot delete your own user": {
        errorResponse.message = errorMessage;
        errorResponse.statusCode = STATUS_CODES.FORBIDDEN;
        break;
      }
    }
    return createApiResponse(errorResponse);
  }
}
