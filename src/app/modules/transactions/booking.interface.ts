import { Model, Types } from "mongoose";

export type IBooking = {
    user: Types.ObjectId,
    provider: Types.ObjectId,
    service: Types.ObjectId,
    price: Number,
    bookingId:String,
    status?: 'Pending' | 'Completed' | "Ongoing" | "Rejected" | "Refunded",
    payment_method: 'cash' | 'card',
    booking_date: String,
    transactionId: String,
    booking_time: String
}

export type BookingModel = Model<IBooking>;