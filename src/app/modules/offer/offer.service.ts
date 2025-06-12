import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { IOffer } from "./offer.interface";
import { Offer } from "./offer.model";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { sendNotifications } from "../../../helpers/notificationsHelper";
import { Post } from "../post/post.model";


import config from "../../../config";

import { MercadoPagoConfig, Preference } from 'mercadopago';
const client = new MercadoPagoConfig({
    accessToken: config.mercado_secret as string,
    options: { timeout: 5000 }
});

const preference = new Preference(client);

const createOfferToDB = async (payload: IOffer): Promise<{}> => {
    const isExistService = await Post.findById(payload.service);

    if (!isExistService) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Service not found");
    }

    payload.provider = isExistService.user;
    payload.price = isExistService.price;

    const offer = await Offer.create(payload);
    if (!offer) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create offer");
    } else {
        const data = {
            text: `is requesting to book your service`,
            sender: payload.user,
            receiver: payload.provider,
            referenceId: offer._id,
            screen: "OFFER"
        }

        await sendNotifications(data)
    }

    const paymentData = {
        items: [
            {
                id: "1234",
                title: "Product",
                quantity: 1,
                unit_price: Number(isExistService.price)
            }
        ],
        payer: {
            email: payload.user
        },
        back_urls: {
            success: 'https://nadir3000.binarybards.online/success', // Optional but recommended
            failure: 'https://nadir3000.binarybards.online/faillure', // Optional
            pending: 'https://nadir3000.binarybards.online/pending', // Optional
        },
        auto_return: 'approved', // Optional
    };

    const response = await preference.create({ body: paymentData } as any);
    return { _id: offer?._id, url: response?.init_point };
}

const getOfferFromDB = async (user: JwtPayload): Promise<IOffer[]> => {

    const offers = await Offer.find({ provider: user?.id })
        .populate([
            {
                path: "user",
                select: "name profile"
            },
            {
                path: "service",
                select: "title image price"
            }
        ])
        .select("user service status")
        .lean()

    return offers;
}

const offerHistoryFromDB = async (user: JwtPayload, query: Record<string, any>): Promise<IOffer[]> => {

    const { page, limit } = query;

    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;

    const offers = await Offer.find({ user: user?.id })
        .populate([
            {
                path: "provider",
                select: "name"
            },
            {
                path: "service",
                select: "title image price category"
            }
        ])
        .select("provider service status")
        .lean()
        .skip(skip)
        .limit(size);

    const count = await Offer.countDocuments({ user: user?.id });

    const data: any = {
        offers,
        meta: {
            page: pages,
            total: count
        }
    }

    return data;
}

const getOfferDetailsFromDB = async (id: string): Promise<IOffer | null> => {

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
        ]).select("user service status offerId offerDescription createdAt").lean();
    return offer;
}

const respondOfferToDB = async (id: string, status: any): Promise<IOffer | undefined> => {

    const result = await Offer.findByIdAndUpdate({ _id: id }, { status: status }, { new: true })
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to change  offer Status");
    }
    return result;
}

const transactionHistoryFromDB = async (user: JwtPayload): Promise<IOffer[] | null> => {

    const transactions = await Offer.find(
        {
            $or: [ { user: user.id }, { provider: user.id } ],
            status: "Completed",
            paymentStatus: "Paid"

        }
    )
        .select("price createdAt updatedAt txid user provider")
        .lean();

    // Add `status` field to each transaction
    const result = transactions.map((transaction) => {
        const payment = transaction.user.toString() === user.id.toString() ? "Cash Out" : "Cash In";
        return {
            ...transaction,
            payment,
        };
    });

    return result;
};

const confirmPaymentToDB = async (id: string): Promise<IOffer> => {
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
    }
    
    const result = await Offer.findByIdAndUpdate({ _id: id }, { paymentStatus: "Paid" }, { new: true })
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to change  offer Status");
    }
    return result;
}

const deleteReservationFromDB = async (id: string): Promise<IOffer> => {
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
    }
    
    const result = await Offer.findByIdAndDelete({ _id: id })
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete reservation");
    }
    return result;
}

export const OfferService = {
    createOfferToDB,
    getOfferFromDB,
    respondOfferToDB,
    getOfferDetailsFromDB,
    offerHistoryFromDB,
    transactionHistoryFromDB,
    confirmPaymentToDB,
    deleteReservationFromDB
}