import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { headers } from "next/headers";

import { verifyJWT } from "@/helpers/jwt-verify";
import { createApiResponse } from "@/lib/api-response";
import { STATUS_CODES } from "@/lib/constants";
import dbConnect from "@/lib/db-connect";
import { isStringFiniteNumber } from "@/lib/utils";
import UserModel from "@/models/user.model";

export async function POST(req: Request): Promise<Response> {
  await dbConnect();
  const { identifier, oldPassword, newPassword } = await req.json();

  if (!identifier || !newPassword) {
    return createApiResponse({
      success: false,
      statusCode: STATUS_CODES.BAD_REQUEST,
      message: "Please provide all the required credentials",
    });
  }
  const userId = Types.ObjectId.isValid(identifier)
    ? new Types.ObjectId(identifier)
    : null;

  const user = await UserModel.findOne({
    $or: [
      { _id: userId },
      { email: identifier },
      {
        phoneNumber: isStringFiniteNumber(identifier) ? Number(identifier) : "",
      },
    ],
  });

  if (!user) {
    return createApiResponse({
      success: false,
      statusCode: STATUS_CODES.NOT_FOUND,
      message: "User not found",
    });
  }

  // if user is not login in first time, enter this flow
  if (user.isVerified) {
    const headersPayload = headers();
    const token = headersPayload.get("authorization")?.split(" ")[1] ?? "";
    try {
      await verifyJWT(token, process.env.ACCESS_TOKEN_SECRET ?? "");
    } catch (error) {
      return createApiResponse({
        success: false,
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "You are not allowed to perform this action. Please login.",
      });
    }
    if (!oldPassword) {
      return createApiResponse({
        success: false,
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: "Please provide all the required credentials",
      });
    }
    try {
      const isOldPasswordcorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );

      if (!isOldPasswordcorrect) {
        return createApiResponse({
          success: false,
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: "Please enter valid old password",
        });
      }
    } catch (error) {
      return createApiResponse({
        success: false,
        statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: "Something went wrong while changing the password.",
      });
    }
  }

  // All users flow
  try {
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    user.isVerified = true;
    await user.save();
    return createApiResponse({
      success: true,
      statusCode: STATUS_CODES.OK,
      message: "Successfully changed the password.",
    });
  } catch (error) {
    return createApiResponse({
      success: false,
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: "Something went wrong while change the password.",
    });
  }
}
