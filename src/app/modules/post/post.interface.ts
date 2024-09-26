import { Model, Types } from 'mongoose';

export type IPost = {
  user: Types.ObjectId;
  image?: string;
  title: string;
  price: number;
  price_breakdown: string;
  description: string;
  category: string;
  location: string;
  rating?: number;
  totalRating?: Number;
};

export type PostModal = Model<IPost>;
