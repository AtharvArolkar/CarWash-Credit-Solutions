import { createApiResponse } from "@/lib/api-response";
import { STATUS_CODES } from "@/lib/constants";
import dbConnect from "@/lib/db-connect";
import UserModel from "@/models/user.model";

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json();
    await dbConnect();

    const user = await UserModel.findOne({
      $or: [
        { email: identifier },
        {
          phoneNumber: Number.isFinite(Number(identifier))
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
