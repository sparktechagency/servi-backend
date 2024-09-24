import { model, Schema } from "mongoose";
import { IBooking, BookingModel } from "./booking.interface"

const bookingSchema = new Schema<IBooking, BookingModel>(
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
        bookingId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Complete", "Ongoing", "Reject"],
            default: "Pending"
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
        },
        booking_time: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
);

export const Booking = model<IBooking, BookingModel>("Booking", bookingSchema);