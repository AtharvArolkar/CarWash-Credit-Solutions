import { Ticket, WashType } from "@/types/ticket";
import mongoose, { Schema } from "mongoose";

const TicketSchema: Schema<Ticket> = new Schema(
  {
    carNumber: {
      type: String,
      required: [true, "Car number is required"],
    },
    carModel: {
      type: String,
      required: [true, "Car model is required"],
    },
    washType: {
      type: String,
      required: [true, "Wash type is required"],
      enum: Object.values(WashType),
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    pricePaid: {
      type: Number,
      required: true,
    },
    isCredit: {
      type: Boolean,
      required: false,
      default: false,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const TicketModel =
  (mongoose.models.Ticket as mongoose.Model<Ticket>) ||
  mongoose.model("Ticket", TicketSchema);

export default TicketModel;
