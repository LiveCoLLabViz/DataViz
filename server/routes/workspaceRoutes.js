import express from 'express'
import { createWorkspace, deleteWorkspace, getWorkspace } from '../controllers/workspaceController.js'


const router=express.Router()

router.post('/create/:userId',createWorkspace);
router.get('/get/:workspaceId',getWorkspace);
router.delete('/delete/:workspaceId/:userId',deleteWorkspace)

export default router