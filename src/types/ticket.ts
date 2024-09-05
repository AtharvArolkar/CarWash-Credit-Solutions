import { Document, Types } from "mongoose";

export interface Ticket extends Document {
  carNumber: string;
  carModel: string;
  washType: WashType;
  price: number;
  pricePaid: number;
  isCredit?: boolean;
  clientId?: Types.ObjectId;
  createdBy: Types.ObjectId;
}

export enum WashType {
  bodyWash = "BODY_WASH",
  fullWash = "FULL_WASH",
}

export interface GetTicketsPayload {
  page: number;
  startDate?: number;
  endDate?: number;
  search?: string;
  hideCredits?: boolean;
}

export interface TicketReponse {
  carNumber: string;
  carModel: string;
  washType: string;
  price: number;
  pricePaid: number;
  isCredit: boolean;
  createdAt: string;
  client: {
    name: string;
  };
  paymentMethod?: string;
}

export interface GetTicketsResposne {
  returnedTickets: number;
  totalTickets?: number;
  tickets: TicketReponse[];
}
