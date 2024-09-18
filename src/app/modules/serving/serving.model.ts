import { model, Schema } from 'mongoose';
import { IServing, ServingModal } from './serving.interface';

const servingSchema = new Schema<IServing, ServingModal>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    price_breakdown: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    service: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      default: 0
    },
    totalRating: {
      type: Number,
      required: false,
      default: 0
    }
  },
  { timestamps: true }
);

//exist user check
servingSchema.statics.isExistServingById = async (id: string) => {
  const isExist = await Serving.findById(id);
  return isExist;
};

export const Serving = model<IServing, ServingModal>('Serving', servingSchema);