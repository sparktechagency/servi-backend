import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { User } from "../user/user.model";
import { IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { JwtPayload } from "jsonwebtoken";
import generateBookingId from "../../../util/generateBookingId";
import { Notification } from "../notification/notification.model";


const createBooking= async(payload: IBooking): Promise<IBooking>=>{

    const isExistUser = await User.findById(payload.user);
    if(!isExistUser){
        throw new ApiError(StatusCodes.NOT_FOUND, "No User found");
    }

    const { price } = payload;

    if(typeof price === "string"){
        payload.price = Number(price);
    }

    const createBooking={
        ...payload,
        bookingId: generateBookingId()
    }

    const booking = await Booking.create(createBooking);
    if(!booking){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Booked A Booking")
    }

    const data ={
        user: payload?.provider,
        text: `${isExistUser?.name} is requesting to book your service`,
    }

    const result =  await Notification.create(data)
    //@ts-ignore
    const socketIo = global.io;

    if(socketIo){
        socketIo.emit(`get-notification::${payload.provider}`, result);
    }

    return booking;
}

const myBookingFromDB = async(user: JwtPayload): Promise<IBooking[]>=>{
    const result = await Booking.find({provider: user?.id}).populate({
        path: "user",
        select: "name profile"
    })
    return result;
}

// respond for booking status 
const respondBookingToDB = async (id: string, status: string): Promise<IBooking | null> => {

        // Update the booking status
        const result:any = await Booking.findByIdAndUpdate(
            { _id: id },
            { status: status },
            { new: true }
        );

        // Check if the booking was found and updated
        if (!result) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update booking.");
        }

        // Create a notification for the user
        const notificationData = {
            user: result.user,
            text: `Your Booking is ${status}`,
        };
        
        const notification = await Notification.create(notificationData);

        // Emit the notification to the user via Socket.IO
        const socketIo = (global as any).io;
        if (socketIo) {
            socketIo.emit(`get-notification::${result.user}`, notification);
        }

        return result;
};


const whoBookingFromDB = async(user: JwtPayload): Promise<IBooking[]> => {

    const bookingList: any = await Booking.find({provider: user?.id})
    .populate({ path: "user", select: "name profile"}).select("user");

    return bookingList;
};


const bookingDetailsFromDB = async(id: string): Promise<IBooking | {}> => {

    const bookings:any = await Booking.findById({id})
    .populate({ path: "user", select: "name profile"}).select("user");

    return bookings;
};

const transactionHistoryFromDB = async(user: JwtPayload): Promise<IBooking | {}> => {

    const bookings:any = await Booking.find({provider: user?.id, status: "Complete"}).select("price bookingId updatedAt");

    return bookings;
};


export const BookingService = {
    createBooking,
    myBookingFromDB,
    respondBookingToDB,
    whoBookingFromDB,
    bookingDetailsFromDB,
    transactionHistoryFromDB
}