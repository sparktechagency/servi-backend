import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { IServing } from "./serving.interface"
import { Serving } from "./serving.model";
import { User } from "../user/user.model";
import unlinkFile from "../../../shared/unlinkFile";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import { Bookmark } from "../bookmark/bookmark.model";
import { Review } from "../review/review.model";

const createServing = async (payload: IServing): Promise<IServing> => {

    const user = payload.user as unknown as string;
    // check artist is add all bank info or not
    /* const isExistBank = await User.isAccountCreated(artist);
    if(!isExistBank){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Please Put all of your bank info then try again");
    } */

    const { price, ...othersData } = payload;

    payload.price = Number(price);

    const result:any = await Serving.create(payload);
    if(!result){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Failed to create Serving");
    }

    if(result?._id){         
        await User.findByIdAndUpdate({_id: result?.user}, {$set: {serving: result?._id}});  
    }

    return result;
}

const updateServing = async (payload: any, user: any): Promise<IServing | null> => {

    const isValidUser: any = await User.findById(user?.id).select("+serving");
    const isExistServing: any = await Serving.findById({_id: new mongoose.Types.ObjectId(isValidUser?.serving as string)});

    if (!isExistServing) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized to edit Serving");
    }

    const { image, ...othersValue } = payload;

    // Remove file only if `imagesToDelete` is present
    if (image) {
        unlinkFile(isExistServing?.image);
        othersValue.image = image
    }

    // Update Serving and return result
    const result = await Serving.findByIdAndUpdate(
        { _id: isValidUser?.serving },
        othersValue,
        { new: true }
    );
    return result;
};

const deleteServingFromDB = async (id:string): Promise<IServing | undefined> => {
    const serving = await Serving.findByIdAndDelete(id);
    if(!serving){
        throw new ApiError(StatusCodes.NOT_FOUND, "No Post Found To Deleted");
    }
    return;
}

const myServingListFromDB = async (user:JwtPayload): Promise<IServing[]> => {
    const servings:any = await Serving.find({user: user?.id}).select("title image price description service");
    return servings;
}

const servingListFromDB = async (query:any): Promise<IServing[]> => {
    
    const {search, rating, minPrice, maxPrice, ...filerData } = query;
    const anyConditions = [];

    //service search here
    if (search) {
        anyConditions.push({
            $or: ["title", "service"].map((field) => ({
                [field]: {
                    $regex: search,
                    $options: "i"
                }
            }))
        });
    }

    // artist filter here
    if(Object.keys(filerData).length){
        anyConditions.push({
            $and: Object.entries(filerData).map(([field, value])=>({
                [field]: value
            }))
        })
    }

    //service filter with price range
    if (maxPrice && minPrice) {
        anyConditions.push({
            price: {
                $gte: Number(minPrice),
                $lte: Number(maxPrice)
            },
        });
    }
    
    //service filter with rating range
    if (rating) {
        anyConditions.push({
            rating: {
                $gte: Number(rating),
                $lt: Number(rating) + 1
            },
        });
    }

    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    const services:any = await Serving.find(whereConditions).select("title image price description service");


    // get all of
    const bookmarkId = await Bookmark.find({}).distinct("service");
    const bookmarkIdStrings = bookmarkId.map((id:any) => id.toString());

    // concat with bookmark id all of the service.
    const serviceList = services?.map((item:any) => {
        const service = item.toObject();
        const isBookmark = bookmarkIdStrings.includes(service?.user?.toString());

        const data:any = {
            ...service,
            bookmark: isBookmark
        }
        return data;
    });

    return serviceList;
}

const servingDetailsFromDB = async (id:any): Promise<IServing | {}> => {

    const service:any = await Serving.findById(id)
    .populate({path: "user", select: "name profile"})
    .select("user image title price price_breakdown description service location rating totalRating");
    
    const reviews:any = await Review.find({service: service?._id}).populate({path: "user", select: "name profile"}).select(" user comment rating");

    const result = service?.toObject();
    const data ={
        ...result,
        reviews: reviews
    }
    
    return data;
}

const popularServiceFromDB = async (): Promise<IServing[]> => {

    // find popular provider by rating
    const service:any = await Serving.find({rating: {$gt: 0}}).select("image title rating location");

    // get all of
    const bookmarkId = await Bookmark.find({}).distinct("service");
    const bookmarkIdStrings = bookmarkId.map((id:any) => id.toString());

    // concat with bookmark id all of the service.
    const popularService = service?.map((item:any) => {
        const service = item.toObject();
        const isBookmark = bookmarkIdStrings.includes(service?.user?.toString());

        const data:any = {
            ...service,
            bookmark: isBookmark
        }
        return data;
    });

    return popularService;
}

const recommendedServiceFromDB = async (): Promise<IServing[]> => {

    // find latest provider by rating
    const service:any = await Serving.find({})
        .sort({ createdAt: -1 }) 
        .select("image title rating location");

    // get all of
    const bookmarkId = await Bookmark.find({}).distinct("service");
    const bookmarkIdStrings = bookmarkId.map((id:any) => id.toString());

    // concat with bookmark id all of the service.
    const recommendedService = service?.map((item:any) => {
        const service = item.toObject();
        const isBookmark = bookmarkIdStrings.includes(service?.user?.toString());

        const data:any = {
            ...service,
            bookmark: isBookmark
        }
        return data;
    });

    return recommendedService;
}

export const ServingService = { 
    createServing, 
    updateServing, 
    deleteServingFromDB, 
    servingListFromDB,
    myServingListFromDB,
    popularServiceFromDB,
    servingDetailsFromDB,
    recommendedServiceFromDB
} 