import { Message } from "../message/message.model";
import { IChat } from "./chat.interface";
import { Chat } from "./chat.model";


const createChatToDB = async(payload:any): Promise<IChat> =>{

    const isExistChat = await Chat.findOne({
        participants: { $all: payload }
    });


    if(isExistChat){
        return isExistChat
    }
    const chat:any = await Chat.create({participants: payload});
    return chat;
}

const getChatFromDB = async(user:any): Promise<IChat[]> =>{

    const chats:any = await Chat.find({participants: { $in: [user.id] }})
        .populate({
            path: "participants",
            select: "_id name profile",
            match: { _id: { $ne: user.id } } // Exclude user.id in the populated participants
        });
    
    //Use Promise.all to handle the asynchronous operations inside the map
    const chatList = await Promise.all(chats?.map(async (chat:any) => {
        const data = chat?.toObject();
        const lastMessage:any = await Message.findOne({ chatId: chat?._id }).sort({ createdAt: -1 }).select("message createdAt")
      
        return {
            ...data,
            lastMessage: lastMessage || {}
        };
    }));
    

    return chatList;
}

export const ChatService = { createChatToDB, getChatFromDB };