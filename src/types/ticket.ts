import { Document, Types } from "mongoose";

export interface Ticket extends Document {
  carNumber: string;
  carModel: string;
  washType: WashType;
  price: number;
  pricePaid: number;
  isCredit: boolean;
  clientId: Types.ObjectId;
}

export enum WashType {
  bodyWash = "BODY_WASH",
  fullWash = "FULL_WASH",
}
