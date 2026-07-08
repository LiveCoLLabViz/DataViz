import {v2 as cloudinary} from 'cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config();

if(!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET){
    throw new Error("Cloudinary configuration is missing in the environment variables.");
}

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadDir = path.join(process.cwd(), 'uploads', 'tmp');
//uploadDir is the directory where the uploaded files will be stored temporarily before they are uploaded to cloudinary, we are using path.join to create a path that is compatible with all operating systems, process.cwd() returns the current working directory of the node process, which is the root of the project, we are creating a folder called uploads and a subfolder called tmp inside it, this is where the uploaded files will be stored temporarily

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);

   // tells Multer to save the file in uploadDir.
     //The null means no error.
    },
    filename: (req, file, cb) => {
        const safeBase = file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
        cb(null, `${Date.now()}-${safeBase}`);
    }
})
//multer is a middleware that is used to handle multipart/form-data, which is used for uploading files
//multipart/form-data is a type of encoding that allows us to send files and data in the same request, it is used when we want to upload files to the server

//multer-storage-cloudinary is a storage engine for multer that allows us to store files in cloudinary
export const upload=multer({
    storage,
    limits: {fileSize: 5 * 1024 * 1024}, //5MB file size limit
    fileFilter:(req,file,cb)=>{
        const ext = path.extname(file.originalname).toLowerCase();
        const allowed = ['.csv', '.json', '.xlsx', '.xls'];

        if (!allowed.includes(ext)) {
            return cb(new Error('Only CSV, JSON, XLSX and XLS files are allowed'), false);
        }

        cb(null,true);
    }

    //fileFilter: (req, file, cb) => { ... }

    //A callback that runs before Multer accepts the file.
   //Used to decide whether the file should be allowed or rejected.
    //fileFilter is a function that is used to filter the files that are uploaded, we can use it to check the file type and size, if the file is not valid we can return an error
    //storage is the storage engine that we are using to store the files in cloudinary, we can use it to specify the folder name and allowed formats
})

//the above upload is a middleware that we can use in our routes to handle file uploads, we can use it like this: upload.single('file') for single file upload and upload.array('files', 10) for multiple file upload, where 'file' and 'files' are the names of the input fields in the form and 10 is the maximum number of files that can be uploaded at once

export default cloudinary;

// Multer is doing a different job than Cloudinary.

// Cloudinary only uploads the file after it already exists somewhere. Multer handles the incoming HTTP request first.

// In your setup, Multer is used for:

// reading multipart/form-data from the client
// accepting the uploaded file from the request
// rejecting files that are too large
// rejecting unsupported extensions like txt or png
// saving the file temporarily on your server at uploads/tmp
// Then Cloudinary is used for:

// taking that temporary local file
// uploading it to Cloudinary
// returning the final Cloudinary URL and public_id
// So the flow is:

// client uploads file -> Multer receives and stores it locally -> your controller parses it -> Cloudinary uploads it -> MongoDB saves metadata





// multer is the file receiver. It handles the incoming multipart/form-data request, checks the file size and extension, and saves the uploaded file temporarily on your server in uploads/tmp. In your project, this is configured in config/cloudinary.config.js and used in routes/datasetUpload.js. Example: when you send a CSV file with key file, Multer accepts it only if it is .csv, .json, .xlsx, or .xls, and only if it is under 5 MB.

// cloudinary is the file storage service. After Multer saves the file locally, your controller uploads that local file to Cloudinary using cloudinary.uploader.upload(...) in controllers/datasetController.js. Example: your dataset file is pushed to Cloudinary under livecolab/datasets, and Cloudinary returns a secure_url and public_id, which you then store in MongoDB.