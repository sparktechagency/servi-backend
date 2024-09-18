import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { IServing } from "./serving.interface"
import { Serving } from "./serving.model";
import { User } from "../user/user.model";
import unlinkFile from "../../../shared/unlinkFile";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";

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


const servingListFromDB = async (user:JwtPayload): Promise<IServing[]> => {
    const servings:any = await Serving.find({user: user?.id}).select("title image price description service");
    return servings;
}


export const ServingService = { createServing, updateServing, deleteServingFromDB, servingListFromDB } 