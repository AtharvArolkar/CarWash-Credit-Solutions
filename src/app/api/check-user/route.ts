import { createApiResponse } from "@/lib/api-response";
import { STATUS_CODES } from "@/lib/constants";
import dbConnect from "@/lib/db-connect";
import { isStringFiniteNumber } from "@/lib/utils";
import UserModel from "@/models/user.model";

export async function POST(req: Request): Promise<Response> {
  try {
    console.log("CHECKKKKKKKKKKKKKK");
    const { identifier } = await req.json();
    return createApiResponse({
      success: false,
      statusCode: STATUS_CODES.OK,
      message: "Connection check",
    });
    await dbConnect();

    const user = await UserModel.findOne({
      $or: [
        { email: identifier },
        {
          phoneNumber: isStringFiniteNumber(identifier)
            ? Number(identifier)
            : "",
        },
      ],
    });
    if (user) {
      return createApiResponse({
        success: true,
        statusCode: STATUS_CODES.OK,
        message: "Found user",
        body: { user },
      });
    } else {
      return createApiResponse({
        success: false,
        statusCode: STATUS_CODES.OK,
        message: "User not found",
      });
    }
  } catch (error) {
    return createApiResponse({
      success: false,
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: "Something went wrong.",
    });
  }
}
