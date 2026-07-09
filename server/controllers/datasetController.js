import Workspace from "../models/workspace.js";
import Dataset from "../models/datasets.js";
import mongoose from 'mongoose';
import parseCSV from "../utils/parsecsv.js";
import parseExcel from "../utils/parseexcel.js";
import fs from 'fs';
import path from 'path';
import cloudinary from "../config/cloudinary.config.js";

export const uploadDataset=async(req,res)=>{
    if(!req.file){
        return res.status(400).json({error:"No file uploaded"});
    }

    const {workspaceId}=req.params;

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({error:"Invalid Workspace ID format."});
    }

    let workspace;
    try {
        workspace = await Workspace.findById(workspaceId);
    } catch (err) {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({error:"Database error while finding workspace."});
    }

    if(!workspace){
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({error:"Workspace not found"});
    }
    //workspaceId will be sent in the request body, we will use it to find the workspace and add the dataset to it
    //how can we get the workspaceId from the request body? we can get it from req.body.workspaceId
    //but when we are uploading the file using multer, the req.body will be empty, so we need to use multer's fileFilter option to get the workspaceId from the request body and add it to the req.file object 

    //fs.existsSync is a method that checks if a file exists synchronously, it returns true if the file exists and false if it doesn't, we are using it to check if the file exists before deleting it, because if the file doesn't exist and we try to delete it, it will throw an error
    //why synchronously? because we want to delete the file immediately after we are done with it, we don't want to wait for the event loop to finish, because if we wait, the file might be deleted before we are done with it, and we will get an error
    //fs.unlinkSync is a method that deletes a file synchronously, it throws an error if the file doesn't exist, we are using it to delete the file after we are done with it, because we don't want to keep the file on the server after we are done with it, it will take up space and we don't want that
    

    const localFilePath=req.file.path;
    const originalFileName=req.file.originalname;
    const fileExtension=path.extname(originalFileName).toLowerCase();

    let parsedData=[];
    let columns=[];
    let cloudinaryResult=[]

    try {
        if(fileExtension==='.csv'){
            const result=await parseCSV(localFilePath);
            parsedData=result.data;
            columns=result.columns;

        }
        else if(fileExtension==='.xlsx' || fileExtension==='.xls'){
            const result=await parseExcel(localFilePath);
            parsedData=result.data;
            columns=result.columns;
        }
        else if (fileExtension==='.json'){
            const fileContent=fs.readFileSync(localFilePath,'utf-8');
            //parse the json file and check if it is an array of objects, if not throw an error
            //'utf-8' is the encoding of the file, it is used to read the file as a string, if we don't specify the encoding, it will return a buffer, which we don't want, because we want to parse the json file as a string
             const parsed=JSON.parse(fileContent);

             //here filecontent is a string, we are parsing it to an object using JSON.parse, if the json file is not valid, it will throw an error, we are catching that error in the catch block and returning a 400 error with the message "Invalid JSON file"
             //eg. if the json file is like this:
             //[
             //  { "name": "John", "age": 30 },
             //  { "name": "Jane", "age": 25 }
             //]
             //it will be parsed to an array of objects, if the json file is like this:
             //{
             //  "name": "John", "age": 30
             //}
             //it will be parsed to an object, which is not what we want, we want an array of objects, so we are checking if the parsed data is an array or not, if it is not an array, we are throwing an error with the message "JSON file must contain an array of objects"  

             if(!Array.isArray(parsed)){
                throw new Error("JSON file must contain an array of objects");
             }

             parsedData=parsed;
             columns=parsedData.length>0?Object.keys(parsedData[0]):[]
        }
        else{
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
            return res.status(400).json({error:"Unsupported file format"});
        }

        if(parsedData.length===0 || columns.length===0){
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
            return res.status(400).json({error:"No data found in the file"});
        }
        const MAX_ROWS=5000;

        if(parsedData.length>MAX_ROWS){
            parsedData=parsedData.slice(0,MAX_ROWS);
        }

        const baseName = path.basename(originalFileName, fileExtension);
        const safeBase = baseName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '').trim();

        cloudinaryResult= await cloudinary.uploader.upload(localFilePath,{
            resource_type:'raw',
            //resource type raw means any file type, we are using raw because we are uploading csv, excel and json files

            folder:'livecolab/datasets',
            public_id: `${workspace._id}_${Date.now()}_${safeBase}`,
        });

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        const newDataset=new Dataset({
            name:originalFileName,
             workspaceId:workspaceId,
            OriginalfileName:originalFileName,
            filetype:fileExtension.replace('.',''),
             filePath:cloudinaryResult.secure_url,
            columns:columns,
            ParsedData:parsedData,
            rowCount:parsedData.length,
            uploadedAt:new Date(),
        })

        const savedDataset=await newDataset.save();

        await Workspace.findByIdAndUpdate(workspaceId,{$push:{datasets:savedDataset._id}});

        return res.status(201).json({
            message:"Dataset uploaded and parsed successfully.",
            dataset:savedDataset,   
        })
    } catch (error) {
        console.error("DATASET UPLOAD ERROR:", error);
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return res.status(400).json({error:error.message});
    }
}


//we should upload in cloudinary not in database, we should only save the file details in the database, so that we can access the file later using the public_id

export const getDatasetsByWorkspace=async(req,res)=>{
    try{
           const {workspaceId}=req.params;
         if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
            return res.status(400).json({ error: "Invalid workspaceId" });
         }

         const workspace = await Workspace.findById(workspaceId);
         if (!workspace) {
            return res.status(404).json({ error: "Workspace not found" });
         }

         const datasets=await Dataset.find({workspaceId}).sort({uploadedAt:-1});
         return res.status(200).json({datasets});
    }
    catch(error){
        return res.status(500).json({error:"Internal Server Error"});
    }
}

export const getDatasetById=async(req,res)=>{
    try{
        const {datasetId}=req.params;
        if (!mongoose.Types.ObjectId.isValid(datasetId)) {
            return res.status(400).json({ error: "Invalid datasetId" });
        }
        const dataset=await Dataset.findById(datasetId);
        if(!dataset){
            return res.status(404).json({error:"Dataset not found"});
        }
        return res.status(200).json({dataset});
    }
    catch(error){
        return res.status(500).json({error:"Internal Server Error"});
    }
}

export const deleteDataset=async(req,res)=>{
    try{
        const {datasetId}=req.params;
        const dataset=await Dataset.findById(datasetId);
        if(!dataset){
            return res.status(404).json({error:"Dataset not found"});
        }

        await cloudinary.uploader.destroy(dataset.filePath, { resource_type: 'raw' });

        await Dataset.findByIdAndDelete(datasetId);

        return res.status(200).json({message:"Dataset deleted successfully"});
    }
    catch(error){
        return res.status(500).json({error:"Internal Server Error"});
    }
}   

