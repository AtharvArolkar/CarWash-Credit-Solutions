import { Document, Types } from "mongoose";

import { PaymentMethod, Transaction } from "./transaction";
import { User } from "./user";

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
  _id: string;
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

export interface AddTicketPayload {
  carNumber: string;
  carModel: string;
  washType: WashType;
  price: number;
  pricePaid?: number;
  paymentMethod?: PaymentMethod;
  createdBy: string;
  clientId?: string;
  isCredit?: boolean;
}

export interface TicketDetails {
  _id: string;
  carNumber: string;
  carModel: string;
  washType: WashType;
  price: number;
  pricePaid: number;
  isCredit: boolean;
  createdAt: string;
  updatedAt: string;
  transations: Transaction[];
  client: User;
  createdByName: string;
}

export interface TicketDetailsResponse {
  ticket: TicketDetails;
}
