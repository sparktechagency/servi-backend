import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ServingService } from './serving.service';

const createServing = catchAsync(async (req: Request, res: Response) => {
    const servingData = req.body;
    const user = req.user.id;

    let image;
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }

    const payload = {
        ...servingData,
        image,
        user
    }
    
    const result = await ServingService.createServing(payload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Serving created successfully",
        data: result
    });
});

const updateServing = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const updateData = req.body;

    let image;
    if (req.files && "image" in req.files && req.files.image[0]) {
        image = `/images/${req.files.image[0].filename}`;
    }

    const payload = {
        ...updateData,
        image
    }

    const result = await ServingService.updateServing(payload, user);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Serving updated successfully",
        data: result
    });
});

const deleteServing = catchAsync( async(req: Request, res: Response)=>{
    const id = req.params.id;
    await ServingService.deleteServingFromDB(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Post Deleted successfully"
    });
})

const myServingList = catchAsync( async(req: Request, res: Response)=>{
    const user = req.user;
    const result = await ServingService.myServingListFromDB(user);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "My Service Retrieved successfully",
        data: result
    });
})

const serviceList = catchAsync( async(req: Request, res: Response)=>{
    const query = req.query;
    const result = await ServingService.servingListFromDB(query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Service List Retrieved successfully",
        data: result
    });
})

const serviceDetails = catchAsync( async(req: Request, res: Response)=>{
    const id = req.params.id;
    const result = await ServingService.servingDetailsFromDB(id);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Service Details Retrieved successfully",
        data: result
    });
})

const popularService = catchAsync( async(req: Request, res: Response)=>{
    
    const result = await ServingService.popularServiceFromDB();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Popular Service Retrieved successfully",
        data: result
    });
})

export const ServingController = {
    createServing,
    updateServing,
    deleteServing,
    myServingList,
    serviceList,
    popularService,
    serviceDetails
}