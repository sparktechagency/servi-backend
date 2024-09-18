import { Model, Types } from 'mongoose';

export type IMessage = {
    chatId: Types.ObjectId;
    sender: Types.ObjectId;
    text?:string;
    offer?:{
        service: string;
        amount: number;
        details: string;
        bookingId: Types.ObjectId,
        status?: "Accepted" | "Rejected" | "Pending"
    };
    messageType: 'text' | 'offer';
};

export type MessageModel = Model<IMessage, Record<string, unknown>>