import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { BookingService } from "./booking.service";

const createBooking = catchAsync(async(req: Request, res: Response)=>{

    const payload = {
        user: req.user?.id,
        ...req.body
    }
    const result = await BookingService.createBooking(payload)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Booking Booked Successfully",
        data: result
    })
});

const myBooking = catchAsync(async(req: Request, res: Response)=>{

    const user = req.user;
    const result = await BookingService.myBookingFromDB(user)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Booking Retrieved Successfully",
        data: result
    })
})

// respond booking
const respondBooking = catchAsync(async(req: Request, res: Response)=>{

    const id = req.params.id;
    const status = req.query.status as unknown as string;
    const result = await BookingService.respondBookingToDB(id, status)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `Your Booking ${status} Successfully`,
        data: result
    })
})

const whoBooking= catchAsync(async(req: Request, res: Response)=>{

    const user = req.user;
    const result = await BookingService.whoBookingFromDB(user)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `User Booking Retrieved`,
        data: result
    })
})

// booking summary
const bookingDetails= catchAsync(async(req: Request, res: Response)=>{
    const id = req.params.id;
    const result = await BookingService.bookingDetailsFromDB(id)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `Booking Summary Retrieved`,
        data: result
    })
})

const transactionHistory= catchAsync(async(req: Request, res: Response)=>{
    
    const result = await BookingService.transactionHistoryFromDB(req.user)
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `Transaction History Retrieved`,
        data: result
    })
})

export const BookingController = {
    createBooking,
    myBooking,
    respondBooking,
    whoBooking,
    bookingDetails,
    transactionHistory
}