import mongoose,{Schema} from 'mongoose'

const workspaceSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    members: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    
    datasets:[
       {
          type:mongoose.Schema.Types.ObjectId,
          ref:"Dataset"
       }
    ],
    dashboards:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Dashboard"
    }],
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const Workspace=mongoose.model("Workspace",workspaceSchema);

export default Workspace;
