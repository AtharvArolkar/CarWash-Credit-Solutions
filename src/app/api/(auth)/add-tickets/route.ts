import { JWTVerifyResult } from "jose";
import { Types } from "mongoose";
import { headers } from "next/headers";

import { verifyJWT } from "@/helpers/jwt-verify";
import { createApiResponse } from "@/lib/api-response";
import { STATUS_CODES } from "@/lib/constants";
import dbConnect from "@/lib/db-connect";
import TicketModel from "@/models/ticket.model";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/common";
import { JWTPayloadObject, UserRole } from "@/types/user";

export async function POST(req: Request): Promise<Response> {
  await dbConnect();
  const headerPayload = headers();
  const token = headerPayload.get("authorization")?.split(" ")[1] ?? "";

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
  const { payload } = jwtPayload;
  const userId = new Types.ObjectId(payload?.identifier);
  try {
    const user = await UserModel.findById({ _id: userId });
    if (!user) {
      throw new Error("User not found.");
    }
    if (user.role === UserRole.client) {
      throw new Error("You are not allowed to acces this resource.");
    }

    const requestPayload = await req.json();
    const {
      carNumber,
      carModel,
      washType,
      price,
      pricePaid,
      clientId,
      createdBy,
    } = requestPayload;
    if (
      !carNumber ||
      !carModel ||
      !washType ||
      !price ||
      !pricePaid ||
      createdBy
    ) {
      throw new Error("Invalid request paramters.");
    }

    let isCredit = false;
    if (pricePaid < price) {
      if (!clientId) throw new Error("Invalid request paramters.");
      const clientUser = UserModel.findById({
        _id: new Types.ObjectId(clientId),
      });
      if (!clientUser) {
        throw new Error(
          "No client found, Please register this client before entering the record."
        );
      }
      isCredit = true;
    }

    const newTicket = new TicketModel({
      carNumber,
      carModel,
      washType,
      price,
      pricePaid,
      isCredit,
      clientId,
      createdBy,
    });

    await newTicket.save();

    return createApiResponse({
      success: true,
      statusCode: STATUS_CODES.CREATED,
      message: "Created a ticket.",
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
      case "No client found, Please register this client before entering the record.": {
        errorResponse.message = errorMessage;
        errorResponse.statusCode = STATUS_CODES.NOT_FOUND;
        break;
      }
      case "Invalid request paramters.": {
        errorResponse.message = errorMessage;
        errorResponse.statusCode = STATUS_CODES.BAD_REQUEST;
        break;
      }
      case "You are not allowed to acces this resource.": {
        errorResponse.message = errorMessage;
        errorResponse.statusCode = STATUS_CODES.FORBIDDEN;
        break;
      }
    }
    return createApiResponse(errorResponse);
  }
}
