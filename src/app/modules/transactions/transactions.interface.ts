import { Model, Types } from "mongoose";

export type ITransaction = {
    user: Types.ObjectId;
    provider: Types.ObjectId;
    service: Types.ObjectId;
    price: Number;
    offerId:String;
    status: 'Confirm' | "Refund";
    payment_method: 'cash' | 'card';
    booking_date: String;
    transactionId: String;
}

export type TransactionModel = Model<ITransaction>;