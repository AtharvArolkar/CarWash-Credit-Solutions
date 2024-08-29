import bcrypt from "bcryptjs";
import { ChangePasswordPayload } from "./../../../types/user";
import { createApiResponse } from "@/lib/api-response";
import UserModel from "@/models/user.model";
import { NextApiRequest } from "next";
import { isFinite } from "lodash";
import { STATUS_CODES } from "@/lib/constants";
import { headers } from "next/headers";
import { verifyJWT } from "@/helpers/jwt-verify";
export async function POST(req: Request) {
  //check if all new password and identifier field is present
  //fetch the user details
  // check isverified is false
  // if isverified=true.
  //         check if token is present and valid return error if not valid
  //         check if old password is present in the payload, if no resturn error response
  //         check if old password matches the one in db, if no return error response
  //         if matches, hash and save the new password, return success response
  // if isverified in false.
  //         hash the password.
  //         save the new password and make isVerified to true
  //         return success response
  const { identifier, oldPassword, newPassword } = await req.json();
  // isFinite

  if (!identifier || !newPassword) {
    return createApiResponse(
      false,
      STATUS_CODES.BAD_REQUEST,
      "Please provide all the required credentials"
    );
  }

  const user = await UserModel.findOne({
    $or: [
      { email: identifier },
      { phoneNumber: isFinite(Number(identifier)) ? Number(identifier) : "" },
    ],
  });

  if (!user) {
    return createApiResponse(false, STATUS_CODES.NOT_FOUND, "User not found");
  }

  // if already existing user, enter this flow
  if (user.isVerified) {
    if (!oldPassword) {
      return createApiResponse(
        false,
        STATUS_CODES.BAD_REQUEST,
        "Please provide all the required credentials"
      );
    }
    const headersPayload = headers();
    const token = headersPayload.get("authorization")?.split(" ")[1] ?? "";
    try {
      await verifyJWT(token, process.env.ACCESS_TOKEN_SECRET ?? "");
    } catch (error) {
      return createApiResponse(
        false,
        STATUS_CODES.UNAUTHORIZED,
        "You are not allowed to perform this action. Please login."
      );
    }
    try {
      const isOldPasswordcorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );

      if (!isOldPasswordcorrect) {
        return createApiResponse(
          false,
          STATUS_CODES.BAD_REQUEST,
          "Please enter valid old password"
        );
      }
    } catch (error) {
      return createApiResponse(
        false,
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        "Something went wrong while change the password."
      );
    }
  }

  // if both already existing user + new user
  try {
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    user.isVerified = true;
    await user.save();
    return createApiResponse(
      true,
      STATUS_CODES.OK,
      "Successfully changed the password."
    );
  } catch (error) {
    return createApiResponse(
      false,
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      "Something went wrong while change the password."
    );
  }
}
