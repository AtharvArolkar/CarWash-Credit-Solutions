import { JWTVerifyResult } from "jose";
import { Types } from "mongoose";
import { headers } from "next/headers";

import { verifyJWT } from "@/helpers/jwt-verify";
import { createApiResponse } from "@/lib/api-response";
import { STATUS_CODES } from "@/lib/constants";
import dbConnect from "@/lib/db-connect";
import TicketModel from "@/models/ticket.model";
import TransactionModel from "@/models/transaction.model";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/common";
import { JWTPayloadObject, UserRole } from "@/types/user";

export async function POST(req: Request): Promise<Response> {
  const mongoSession = await dbConnect();
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

  const session = (await mongoSession?.startSession()) ?? null;
  session?.startTransaction();

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
      price: totalTicketAmout,
      pricePaid,
      paymentMethod,
      clientId,
      createdBy,
      isCredit = false,
    } = requestPayload;

    if (
      !carNumber ||
      !carModel ||
      !washType ||
      !totalTicketAmout ||
      pricePaid === undefined ||
      !createdBy ||
      (pricePaid !== 0 && !paymentMethod) ||
      (isCredit && !clientId)
    ) {
      throw new Error("Invalid request paramters.");
    }

    if (clientId) {
      const clientUser = UserModel.findById({
        _id: new Types.ObjectId(clientId),
      });
      if (!clientUser) {
        throw new Error(
          "No client found, Please register this client before entering the record."
        );
      }
    }

    const newTicket = new TicketModel({
      carNumber,
      carModel,
      washType,
      price: totalTicketAmout,
      pricePaid,
      isCredit,
      clientId,
      createdBy,
    });

    const ticket = await newTicket.save({ session });
    if (pricePaid !== 0) {
      const newTransaction = new TransactionModel({
        clientId,
        amount: pricePaid,
        paymentMethod,
        ticketTransacted: [{ ticketId: ticket._id, amount: pricePaid }],
      });
      await newTransaction.save({ session });
    }
    await session?.commitTransaction();
    await session?.endSession();

    return createApiResponse({
      success: true,
      statusCode: STATUS_CODES.CREATED,
      message: "Created a ticket.",
      body: { id: ticket._id },
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    await session?.abortTransaction();
    await session?.endSession();
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
