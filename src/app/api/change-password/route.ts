import bcrypt from "bcryptjs";
import { ChangePasswordPayload } from "./../../../types/user";
import { createApiResponse } from "@/lib/api-response";
import UserModel from "@/models/user.model";
import { NextApiRequest } from "next";
import { isFinite } from "lodash";
import { STATUS_CODES } from "@/lib/constants";
import { headers } from "next/headers";
import { verifyJWT } from "@/helpers/jwt-verify";
import dbConnect from "@/lib/db-connect";
export async function POST(req: Request) {
  await dbConnect();
  const { identifier, oldPassword, newPassword } = await req.json();

  if (!identifier || !newPassword) {
    return createApiResponse({
      success: false,
      statusCode: STATUS_CODES.BAD_REQUEST,
      message: "Please provide all the required credentials",
    });
  }

  const user = await UserModel.findOne({
    $or: [
      { email: identifier },
      { phoneNumber: isFinite(Number(identifier)) ? Number(identifier) : "" },
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