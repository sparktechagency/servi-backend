import { Response, Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import { OfferService } from "./offer.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";


const createOffer = catchAsync(async(req: Request, res: Response)=>{
    const payloadData = {
        ...req.body,
        user: req.user.id
    };
    const result = await OfferService.createOfferToDB(payloadData);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Offer Create Successfully",
        data: result
    })
})

const getOffer = catchAsync(async(req: Request, res: Response)=>{
    const user = req.user;
    const result = await OfferService.getOfferFromDB(user);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Offer Retrieved Successfully",
        data: result
    })
})

const respondOffer = catchAsync(async(req: Request, res: Response)=>{
    const id = req.params.id;
    const status = req.query.status;
    const result = await OfferService.respondOfferToDB(id, status);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Offer Status updated Successfully",
        data: result
    })
})

export const OfferController = {
    createOffer,
    getOffer,
    respondOffer
}