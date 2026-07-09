import express from 'express'
import { createWorkspace, deleteWorkspace, getWorkspace, getAllWorkspaces } from '../controllers/workspaceController.js'


const router=express.Router()

router.post('/create/:userId',createWorkspace);
router.get('/get/:workspaceId',getWorkspace);
router.get('/getall/:userId',getAllWorkspaces);
router.delete('/delete/:workspaceId/:userId',deleteWorkspace)

export default router