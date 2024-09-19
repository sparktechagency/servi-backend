import mongoose from "mongoose";
import { IReview } from "./review.interface";
import { Review } from "./review.model";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { Serving } from "../serving/serving.model";


const createReviewToDB = async(payload: any): Promise<IReview>=>{

    const isServiceExist:any = await Serving.findById({_id: new mongoose.Types.ObjectId(payload.service)});
    if(!isServiceExist){
        throw new ApiError(StatusCodes.NOT_FOUND, "No Service Found");
    }

    if (payload.rating) {

        // checking the rating is valid or not;
        const rating = Number(payload.rating);
        if (rating < 1 || rating > 5) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid rating value");
        }
        

        // Update artist's rating and total ratings count
        const totalRating = isServiceExist.totalRating + 1;

        let newRating;
        if (isServiceExist.rating === null || isServiceExist.rating === 0) {
            // If no previous ratings, the new rating is the first one
            newRating = rating;
        } else {
            // Calculate the new rating based on previous ratings
            newRating = ((isServiceExist.rating * isServiceExist.totalRating) + rating) / totalRating;
        }
    
        isServiceExist.totalRating = totalRating;
        isServiceExist.rating = Number(newRating).toFixed(2);
    
        // Save the updated salon document
        await isServiceExist.save();
    }

    const result = await Review.create(payload);
    if(!result){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Failed To create Review")
    }
    return payload;
};

const getReviewFromDB = async(id:any): Promise<IReview[]>=>{
    const reviews = await Review.find({service: new mongoose.Types.ObjectId(id)});
    return reviews;
};

export const ReviewService ={ createReviewToDB, getReviewFromDB}