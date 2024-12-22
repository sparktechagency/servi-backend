import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { IPost } from "./post.interface"
import { Post } from "./post.model";
import { User } from "../user/user.model";
import unlinkFile from "../../../shared/unlinkFile";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import { Bookmark } from "../bookmark/bookmark.model";
import { Review } from "../review/review.model";

const createPost = async (payload: IPost): Promise<IPost> => {

    const user = payload.user as unknown as string;
    // check artist is add all bank info or not
    /* const isExistBank = await User.isAccountCreated(artist);
    if(!isExistBank){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Please Put all of your bank info then try again");
    } */

    const { price } = payload;

    payload.price = Number(price);

    const result: any = await Post.create(payload);
    if (!result) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Failed to create Post");
    }

    if (result?._id) {
        await User.findByIdAndUpdate({ _id: result?.user }, { $set: { post: result?._id } });
    }

    return result;
}

const updatePost = async (id: string, payload: IPost): Promise<IPost | null> => {

    // Validate ID before making a database call
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Offer ID');
    }

    const isExistPost: any = await Post.findById({ _id: id });
    if (!isExistPost) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "No Post Found By this ID!");
    }

    //Partial type to indicate that the updateData object might be missing some properties
    const updateData: Partial<IPost> = { ...payload };
    delete updateData.image;

    // Remove file only if `imagesToDelete` is present
    if (payload.image) {
        if (isExistPost.image) { // Make sure there's an existing image before unlinking
            unlinkFile(isExistPost.image);
        }
        updateData.image = payload.image
    }

    // Update Post and return result
    const result = await Post.findByIdAndUpdate(
        { _id: id },
        updateData as IPost,
        { new: true }
    );

    return result;
};

const deletePostFromDB = async (id: string): Promise<IPost | undefined> => {
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No Post Found To Deleted");
    }
    return;
}

const myPostListFromDB = async (user: JwtPayload): Promise<IPost[]> => {

    const posts: any = await Post.find({ user: user?.id })
        .select("title image price description category")
        .lean();
    return posts;
}

const postListFromDB = async (query: any): Promise<IPost[]> => {

    const { search, rating, minPrice, maxPrice, ...filerData } = query;
    const anyConditions = [];

    //service search here
    if (search) {
        anyConditions.push({
            $or: ["title", "category"].map((field) => ({
                [field]: {
                    $regex: search,
                    $options: "i"
                }
            }))
        });
    }

    // artist filter here
    if (Object.keys(filerData).length) {
        anyConditions.push({
            $and: Object.entries(filerData).map(([field, value]) => ({
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
    const services: any = await Post.find(whereConditions).select("title image price description adult category");


    // get all of
    const bookmarkId = await Bookmark.find({}).distinct("post");
    const bookmarkIdStrings = bookmarkId.map((id: any) => id.toString());

    // concat with bookmark id all of the service.
    const serviceList = services?.map((item: any) => {
        const service = item.toObject();
        const isBookmark = bookmarkIdStrings.includes(service?.user?.toString());

        const data: any = {
            ...service,
            bookmark: isBookmark
        }
        return data;
    });

    return serviceList;
}

const postDetailsFromDB = async (id: any): Promise<IPost | {}> => {

    const service: any = await Post.findById(id)
        .populate({ path: "user", select: "name profile" })
        .select("user image title price price_breakdown description category location rating totalRating");

    const reviews: any = await Review.find({ service: service?._id }).populate({ path: "user", select: "name profile" }).select(" user createdAt comment rating");

    const result = service?.toObject();
    const data = {
        ...result,
        reviews: reviews
    }

    return data;
}

const popularServiceFromDB = async (): Promise<IPost[]> => {

    // find popular provider by rating
    const services: any = await Post.find({ rating: { $gt: 0 } }).select("image title adult rating location").lean();

    const popularService = await Promise.all(
        services.map(async (item: any) => {
            const isBookmark = await Bookmark.findOne({ service: item?._id });
            return {
                ...item,
                bookmark: !!isBookmark, // Add bookmark field as a boolean
            };
        })
    );

    return popularService;
}

const recommendedServiceFromDB = async (): Promise<IPost[]> => {

    // find latest provider by rating
    const services: any = await Post.find({})
        .sort({ createdAt: -1 })
        .select("image title rating adult location")
        .lean();



    const recommendedService = await Promise.all(
        services.map(async (item: any) => {
            const isBookmark = await Bookmark.findOne({ service: item?._id });
            return {
                ...item,
                bookmark: !!isBookmark, // Add bookmark field as a boolean
            };
        })
    );

    return recommendedService;
}

export const PostService = {
    createPost,
    updatePost,
    deletePostFromDB,
    postListFromDB,
    myPostListFromDB,
    popularServiceFromDB,
    postDetailsFromDB,
    recommendedServiceFromDB
} 