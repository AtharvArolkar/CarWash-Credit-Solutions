import mongoose, { Schema } from "mongoose";

import {
  PaymentMethod,
  TransactedTicket,
  Transaction,
} from "@/types/transaction";

const TransactedTicketSchema: Schema<TransactedTicket> = new Schema({
  ticketId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  amount: {
    type: Number,
    required: [true, "Ticket amount is required"],
  },
});

const TransactionSchema: Schema<Transaction> = new Schema({
  clientId: { type: Schema.Types.ObjectId, required: false },
  amount: { type: Number, required: [true, "Transaction amount is required"] },
  paymentMethod: {
    type: String,
    required: [true, "Payment method is required"],
    enum: Object.values(PaymentMethod),
  },
  ticketTransacted: [TransactedTicketSchema],
});

const TransactionModel =
  (mongoose.models.Transaction as mongoose.Model<Transaction>) ||
  mongoose.model<Transaction>("Transaction", TransactionSchema);

export default TransactionModel;
