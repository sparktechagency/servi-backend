import { model, Schema } from "mongoose";
import { IOffer, OfferModel } from "./offer.interface";

const offerSchema = new Schema<IOffer, OfferModel>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        provider: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        service: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Completed', "Ongoing", "Rejected"],
            default: "Pending"
        },
        offerId: {
            type: String,
            required: true
        },
        offerDescription: {
            type: String,
            required: false
        },
        price: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
)

export const Offer = model<IOffer, OfferModel>("Offer", offerSchema);