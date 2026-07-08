import mongoose from "mongoose";
const messageschema=new mongoose.Schema({
    workspaceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace",
     
    },

    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
       
    },
    message:{
        type:String,
        required:true
    }
},
{timestamps:true}
);

const Message= mongoose.model("Message",messageschema);

export default Message;
