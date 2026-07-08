import mongoose from "mongoose";
import { Schema } from "mongoose";




const dashboardSchema = new Schema({
    name:{
        type: String,
        required: true

    },
    description:{
        type: String,
        default:""
    },
    
        workspaceId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
           
            index: true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
       

        index: true
    },
    charts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chart",

        }
    ],


    versionHistory: [
    {
      savedAt:{
           type: Date,
           default: Date.now
      },
            
      savedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      chartSnapshot: [ {
           type: mongoose.Schema.Types.ObjectId,
            ref: "Chart",
      } ] 
    }
  ],
},
{
    timestamps: true
}

);

const Dashboard = mongoose.model("Dashboard", dashboardSchema);

export default Dashboard;


