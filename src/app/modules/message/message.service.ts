import { IMessage } from "./message.interface";
import { Message } from "./message.model";


const sendMessageToDB = async(payload:any) : Promise<IMessage>=>{

    const { offer } = payload;

    if(offer){
        payload.messageType = "offer";
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