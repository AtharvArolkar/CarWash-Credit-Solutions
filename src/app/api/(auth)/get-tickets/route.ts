import dayjs from "dayjs";
import { JWTVerifyResult } from "jose";
import { Types } from "mongoose";
import { headers } from "next/headers";

import { verifyJWT } from "@/helpers/jwt-verify";
import { createApiResponse } from "@/lib/api-response";
import { ITEMS_PER_PAGE, STATUS_CODES } from "@/lib/constants";
import dbConnect from "@/lib/db-connect";
import TicketModel from "@/models/ticket.model";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/common";
import { JWTPayloadObject, UserRole } from "@/types/user";

export async function POST(req: Request) {
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

  const userId = new Types.ObjectId(jwtPayload.payload.identifier);
  try {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found.");
    }
    if (user.role === UserRole.client) {
      throw new Error("You are not allowed to acces this resource.");
    }
    const requestPayload = await req.json();

    const {
      page,
      startDate: start,
      endDate: end,
      search: searchByNameAndCarnumber,
    } = requestPayload;
    if (!page) {
      throw new Error("Invalid request paramters.");
    }

    let dateQuery: { createdAt: { $gte?: Date; $lte?: Date } } = {
      createdAt: {},
    };
    if (start && end) {
      const startOfStartDate = dayjs.unix(start).startOf("day").toDate();
      const endOfEndDate = dayjs.unix(end).endOf("day").toDate();
      dateQuery.createdAt = {
        $gte: startOfStartDate,
        $lte: endOfEndDate,
      };
    } else if (end && !start) {
      throw new Error("Please provide start date if providing end date.");
    } else if (start) {
      const startDate = dayjs.unix(start).toDate();
      const startOfStartDate = dayjs(startDate).startOf("day").toDate();
      const endfStartDate = dayjs(startDate).endOf("day").toDate();
      dateQuery.createdAt = {
        $gte: startOfStartDate,
        $lte: endfStartDate,
      };
    } else {
      const todaysDate = dayjs();
      const startOfTodaysDate = dayjs(todaysDate).startOf("day").toDate();
      const endfTodaysDate = dayjs(todaysDate).endOf("day").toDate();
      dateQuery.createdAt = {
        $gte: startOfTodaysDate,
        $lte: endfTodaysDate,
      };
    }
    const searchString = searchByNameAndCarnumber ?? "";
    const result = await TicketModel.aggregate([
      { $match: { ...dateQuery } },
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
          as: "entryBy",
        },
      },
      { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$entryBy", preserveNullAndEmptyArrays: true } },
      {
        $facet: {
          totalCount: [
            {
              $match: {
                $or: [
                  { "client.name": { $regex: new RegExp(searchString, "i") } },
                  { carNumber: { $regex: new RegExp(searchString, "i") } },
                ],
              },
            },
            {
              $count: "count",
            },
          ],
          paginatedResults: [
            {
              $match: {
                $or: [
                  { "client.name": { $regex: new RegExp(searchString, "i") } },
                  { carNumber: { $regex: new RegExp(searchString, "i") } },
                ],
              },
            },
            {
              $project: {
                carNumber: 1,
                createdAt: 1,
                carModel: 1,
                washType: 1,
                price: 1,
                pricePaid: 1,
                isCredit: 1,
                "client.name": 1,
                "client.email": 1,
                "client.phoneNumber": 1,
                "entryBy.name": 1,
              },
            },
            { $skip: ITEMS_PER_PAGE * (page - 1) },
            { $limit: ITEMS_PER_PAGE },
          ],
        },
      },
      {
        $project: {
          totalTickets: { $arrayElemAt: ["$totalCount.count", 0] },
          tickets: "$paginatedResults",
        },
      },
    ]);
    const response = {
      returnedTickets: result[0].tickets.length ?? 0,
      ...result[0],
    };
    return createApiResponse({
      success: true,
      statusCode: STATUS_CODES.OK,
      body: response,
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
      case "You are not allowed to acces this resource.": {
        errorResponse.message = errorMessage;
        errorResponse.statusCode = STATUS_CODES.FORBIDDEN;
        break;
      }
      case "Please provide start date if providing end date.":
      case "Invalid request paramters.": {
        errorResponse.message = errorMessage;
        errorResponse.statusCode = STATUS_CODES.BAD_REQUEST;
        break;
      }
    }
    return createApiResponse(errorResponse);
  }
}
