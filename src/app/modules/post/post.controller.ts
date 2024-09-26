import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PostService } from './post.service';

const createPost = catchAsync(async (req: Request, res: Response) => {
    const postData = req.body;
    const user = req.user.id;

    let image;
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }

    const payload = {
        ...postData,
        image,
        user
    }
    
    const result = await PostService.createPost(payload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Post created successfully",
        data: result
    });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateData = req.body;

    let image;
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }

    const payload = {
        ...updateData,
        image
    }

    const result = await PostService.updatePost(id, payload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Post updated successfully",
        data: result
    });
});

const deletePost = catchAsync( async(req: Request, res: Response)=>{
    const id = req.params.id;
    await PostService.deletePostFromDB(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Post Deleted successfully"
    });
})

const myPostList = catchAsync( async(req: Request, res: Response)=>{
    const user = req.user;
    const result = await PostService.myPostListFromDB(user);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "My Service Retrieved successfully",
        data: result
    });
})

const postList = catchAsync( async(req: Request, res: Response)=>{
    const query = req.query;
    const result = await PostService.postListFromDB(query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Service List Retrieved successfully",
        data: result
    });
})

const postDetails = catchAsync( async(req: Request, res: Response)=>{
    const id = req.params.id;
    const result = await PostService.postDetailsFromDB(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Service Details Retrieved successfully",
        data: result
    });
})

const popularService = catchAsync( async(req: Request, res: Response)=>{
    
    const result = await PostService.popularServiceFromDB();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Popular Service Retrieved successfully",
        data: result
    });
})

const recommendedService = catchAsync( async(req: Request, res: Response)=>{
    
    const result = await PostService.recommendedServiceFromDB();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Recommended Service Retrieved successfully",
        data: result
    });
})

export const PostController = {
    createPost,
    updatePost,
    deletePost,
    myPostList,
    postList,
    popularService,
    recommendedService,
    postDetails
}