import express from 'express'

import { upload } from '../config/cloudinary.config.js';
import { uploadDataset,getDatasetsByWorkspace,getDatasetById, deleteDataset} from '../controllers/datasetController.js';
import authMiddleware from '../middlewares/authMIddleware.js';

const router=express.Router()

router.post('/upload/:workspaceId', authMiddleware, (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ error: 'File too large. Maximum size is 5MB.' });
            }
            return res.status(400).json({ error: err.message || 'File upload failed.' });
        }
        next();
    });
}, uploadDataset);

//


router.get('/workspace/:workspaceId', authMiddleware, getDatasetsByWorkspace);
router.get('/dataset/:datasetId', authMiddleware, getDatasetById);
router.delete('/delete/:datasetId', authMiddleware, deleteDataset);



export default router;

//upload.single('file') is a middleware that is used to handle single file upload, it will look for a file in the request with the name 'file' and will store it in the cloudinary storage that we configured in cloudinary.config.js, it will also add the file details to the request object so that we can access it in the controller
