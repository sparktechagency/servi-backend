import { Schema, model } from 'mongoose';
import { IMessage, MessageModel } from './message.interface';

// Define the schema
const messageSchema = new Schema<IMessage, MessageModel>(
    {
        chatId: { 
            type: Schema.Types.ObjectId, 
            required: true,
            ref: 'Chat' 
        },
        sender: { 
            type: Schema.Types.ObjectId, 
            required: true, 
            ref: 'User'
        },
        text: { type: String },
        image: { type: String },
        offer: {
            service: { 
                type: Schema.Types.ObjectId,
                ref: 'Post'
            },
            price: { 
                type: String, 
                required: false
            },
            offerDescription: { 
                type: String, 
                required: false
            },
            offerId: {
                type: String,
                required: false
            },
            status: {
                type: String,
                enum: ["Accepted", "Rejected", "Pending"],
                required: false
            }
        },
        messageType: { 
            type: String, 
            enum: ['text', "image", "both" , 'offer'], 
            default: "text"
        }
    }, 
    {
        timestamps: true
    }
);

// Pre-save hook to set default offer status
messageSchema.pre<IMessage>('save', function (next) {
    if (this.messageType === 'offer') {

        // Check if offer is present and status is not set
        if (this.offer && !this.offer.status) {
            this.offer.status = 'Pending';
        }
    }
    next();
});


export const Message = model<IMessage, MessageModel>('Message', messageSchema);