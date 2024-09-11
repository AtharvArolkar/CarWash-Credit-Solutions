import { JWTVerifyResult } from "jose";
import { Types } from "mongoose";
import { headers } from "next/headers";

import { verifyJWT } from "@/helpers/jwt-verify";
import { createApiResponse } from "@/lib/api-response";
import { STATUS_CODES } from "@/lib/constants";
import dbConnect from "@/lib/db-connect";
import TicketModel from "@/models/ticket.model";
import UserModel from "@/models/user.model";
import { JWTPayloadObject, UserRole } from "@/types/user";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
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

  try {
    const userId = new Types.ObjectId(jwtPayload.payload.identifier);
    const user = await UserModel.findById({ _id: userId });
    if (!user) {
      throw new Error("User not found.");
    }
    if (user.role === UserRole.client) {
      throw new Error("You are not allowed to acces this resource.");
    }

    const ticketId = new Types.ObjectId(params.id);
    const ticketDetails = await TicketModel.aggregate([
      { $match: { _id: ticketId } },
      {
        $lookup: {
          from: "transactions",
          localField: "_id",
          foreignField: "ticketTransacted.ticketId",
          as: "transations",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "clientId",
          foreignField: "_id",
          as: "client",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          createdByName: "$createdBy.name",
        },
      },
      {
        $project: {
          clientId: 0,
          createdBy: 0,
          "client.isVerified": 0,
          "client.password": 0,
          "client.updatedAt": 0,
        },
      },
    ]);
    return createApiResponse({
      success: true,
      statusCode: STATUS_CODES.OK,
      body: { ticket: ticketDetails[0] },
    });
  } catch (error) {}
  return createApiResponse({ success: true, statusCode: STATUS_CODES.OK });
}
