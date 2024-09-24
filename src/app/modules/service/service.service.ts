import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IService } from './service.interface'
import { Service } from './service.model'
import unlinkFile from '../../../shared/unlinkFile'
import { Post } from '../post/post.model'
import { IPost } from '../post/post.interface'
import { Bookmark } from '../bookmark/bookmark.model'

const createServiceToDB = async (payload: IService) => {
  const {name, image} = payload;
  const isExistName = await Service.findOne({name: name})

  if(isExistName){
    unlinkFile(image);
    throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "This Service Name Already Exist");
  }

  const createService:any = await Service.create(payload)
  if (!createService) {
    unlinkFile(image);
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Service')
  }

  return createService
}

const getServicesFromDB = async (): Promise<IService[]> => {
  const result = await Service.find({})
  return result;
}

const updateServiceToDB = async (id: string, payload: IService) => {
  const isExistService:any = await Service.findById(id);

  if(!isExistService){
    throw new ApiError(StatusCodes.BAD_REQUEST, "Service doesn't exist");
  }
  
  if (payload.image) {
    unlinkFile(isExistService?.image);
  }

  const updateService = await Service.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })

  return updateService
}

const deleteServiceToDB = async (id: string): Promise<IService | null> => {
  const deleteService = await Service.findByIdAndDelete(id)
  if (!deleteService) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Service doesn't exist")
  }
  return deleteService
}

const getServiceByCategoryFromDB = async (service: string): Promise<IPost[]> => {

  const services = await Post.find({service: service}).select("title image price description service");
  
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

export const ServiceServices = {
  createServiceToDB,
  getServicesFromDB,
  updateServiceToDB,
  deleteServiceToDB,
  getServiceByCategoryFromDB
}
