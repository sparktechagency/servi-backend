import { Model, Types } from "mongoose"

export type IOffer = {
    user: Types.ObjectId,
    provider: Types.ObjectId,
    service: Types.ObjectId,
    offerId: string;
    price?:string;
    offerDescription?: string;
    status: 'Pending' | 'Completed' | "Ongoing" | "Rejected",
}

export type OfferModel = Model<IOffer>;