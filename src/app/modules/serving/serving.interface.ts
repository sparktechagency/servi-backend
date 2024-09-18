import { Model, Types } from 'mongoose';

export type IServing = {
  user: Types.ObjectId;
  image: string;
  title: string;
  price: number;
  price_breakdown: string;
  description: string;
  service: string;
  location: string;
  rating?: number;
  totalRating?: Number;
};

export type ServingModal = Model<IServing>;
