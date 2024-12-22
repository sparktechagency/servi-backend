import { model, Schema } from "mongoose";
import { ITransaction, TransactionModel } from "./transactions.interface"

const transactionSchema = new Schema<ITransaction, TransactionModel>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        provider: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        offerId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Confirm", "Refund"],
            default: "Confirm"
        },
        payment_method: {
            type: String,
            enum: ["card", "cash"],
            required: true
        },
        booking_date: {
            type: String,
            required: true
        },
        transactionId: {
            type: String,
            require: true
        }
    },
    {timestamps: true}
);

export const Transaction = model<ITransaction, TransactionModel>("Transaction", transactionSchema);