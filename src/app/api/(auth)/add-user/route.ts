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

export async function POST(req: Request): Promise<Response> {
  await dbConnect();
  const headerPayload = headers();
  const token = headerPayload.get("authorization")?.split(" ")[1] || "";
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

    const requestPayload = await req.json();

    const { name, phoneNumber, role, email } = requestPayload;
    if (!name || !phoneNumber || !role) {
      throw new Error("Invalid request paramters.");
    }

    const checkExisting = await UserModel.findOne({
      $or: [
        { email },
        {
          phoneNumber,
        },
      ],
    });

    if (checkExisting) {
      throw new Error("User with this phoneNumber or email already exists.");
    }

    const newUser = new UserModel({ name, phoneNumber, role, email });

    const createdUser = await newUser.save();
    return createApiResponse({
      success: true,
      statusCode: STATUS_CODES.CREATED,
      message: "Created user.",
      body: { id: createdUser._id },
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    const errorResponse: ApiResponse = {
      success: false,
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: errorMessage || "Something went wrong.",
    };
    switch (errorMessage) {
      case "User not found.": {
        errorResponse.message = errorMessage;
        errorResponse.statusCode = STATUS_CODES.NOT_FOUND;
        break;
      }
      case "You are not allowed to access this resource.": {
        errorResponse.message = errorMessage;
        errorResponse.statusCode = STATUS_CODES.FORBIDDEN;
        break;
      }
      case "Invalid request paramters.":
      case "User with this phoneNumber or email already exists.": {
        errorResponse.message = errorMessage;
        errorResponse.statusCode = STATUS_CODES.BAD_REQUEST;
        break;
      }
    }
    return createApiResponse(errorResponse);
  }
}
