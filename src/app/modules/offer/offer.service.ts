import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { IOffer } from "./offer.interface";
import { Offer } from "./offer.model";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

const createOfferToDB = async(payload:any): Promise<IOffer>=>{
    const offer = await Offer.create(payload);
    if(!offer){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create offer");
    }
    return offer;
}

const getOfferFromDB = async(user:JwtPayload): Promise<IOffer[]>=>{
    const offer = await Offer.find({provider: user?.id})
        .populate([
            {
                path: "user", 
                select: "name profile"
            },
            {
                path: "service", 
                select: "title image price"
            }
        ]).select("user service status").lean();
    return offer;
}

const getOfferDetailsFromDB = async(id:string): Promise<IOffer | null>=>{

    // Validate ID before making a database call
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Offer ID');
    }

    const offer = await Offer.findById(id)
        .populate([
            {
                path: "user", 
                select: "name profile location"
            },
            {
                path: "service", 
                select: "title image price price_breakdown"
            }
        ]).select("user service status offerId offerDescription").lean();
    return offer;
}

const respondOfferToDB = async(id:string, status: any): Promise<IOffer | undefined>=>{

    const result = await Offer.findByIdAndUpdate({_id: id}, {status: status}, {new: true})
    if(!result){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to change  offer Status");
    }
    return result;
}

export const OfferService = {
    createOfferToDB,
    getOfferFromDB,
    respondOfferToDB,
    getOfferDetailsFromDB
}