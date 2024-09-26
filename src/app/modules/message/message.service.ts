import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import generateBookingId from "../../../util/generateBookingId";
import { Offer } from "../offer/offer.model";
import { IMessage } from "./message.interface";
import { Message } from "./message.model";


const sendMessageToDB = async(payload:any) : Promise<IMessage>=>{

    const { offer } = payload;
    const offerId = generateBookingId();

    if(offer){
        payload.messageType = "offer";
        offer.offerId= offerId;

        const createOffer = {
            user: payload.sender,
            provider: offer.provider,
            service: offer?.service,
            offerId: offerId,
            price: offer?.price,
            offerDescription: offer?.offerDescription,
        }
        const result = await Offer.create(createOffer);
        if(!result){
            throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create Offer")
        }
    }
    
    // save to DB  
    const response = await Message.create(payload);

    //@ts-ignore
    const io = global.io
    if (io) {
        io.emit(`getMessage::${payload?.chatId}`, response);
    }


    return response;
}

const getMessageFromDB = async(id: any) : Promise<IMessage[]>=>{
    const messages = await Message.find({chatId: id}).sort({ createdAt: -1 })
        .populate({path: "sender", select: "name profile"});
    return messages;
}

const responseOfferStatusToDB = async(id: any, status: string) : Promise<IMessage | {}>=>{

    const messages:any = await Message.findByIdAndUpdate(
        id,
        { $set: { 'offer.status': status } },
        { new: true }
    );

    return messages;
}

export const MessageService = {sendMessageToDB, getMessageFromDB, responseOfferStatusToDB};