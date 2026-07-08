import mongoose,{Schema, SchemaType} from 'mongoose';

const datasetSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    workspaceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace",
    },
    OriginalfileName:{
        type:String,
        required:true,
    },
    filetype:{
        type:String,
        enum:['csv','json','xlsx','xls'],
        required:true,
    },
    filePath:{
        type:String,
        required:true,
    },
    columns:[String],
    ParsedData:[Object],
    
    rowCount:{
        type:Number,
        default:0
    },
    uploadedAt:{
        type:Date,
        default:Date.now()
    }
})

const Dataset=mongoose.model("Dataset",datasetSchema);

export default Dataset;