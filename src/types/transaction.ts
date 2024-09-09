import { Types } from "mongoose";

export interface Transaction {
  clientId?: Types.ObjectId;
  amount: number;
  paymentMethod: PaymentMethod;
  ticketTransacted: TransactedTicket[];
}

export interface TransactedTicket {
  ticketId: Types.ObjectId;
  amount: number;
}

export enum PaymentMethod {
  cash = "CASH",
  gpay = "GPAY",
}
