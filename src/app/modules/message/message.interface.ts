import { Model, Types } from 'mongoose';

export type IMessage = {
    chatId: Types.ObjectId;
    sender: Types.ObjectId;
    text?:string;
    image?:string;
    offer?:{
        service: Types.ObjectId,
        price: string;
        offerDescription: string;
        offerId: string,
        status: 'Pending' | 'Completed' | "Ongoing" | "Rejected",
    };
    messageType: 'text' | "image" | "both" | 'offer';
};

export type MessageModel = Model<IMessage, Record<string, unknown>>