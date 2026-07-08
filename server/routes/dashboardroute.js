

import express from "express";
const router = express.Router();

import {createDashboard,getDashboard,getDashboardById,updateDashboard,deleteDashboard, getDashboardVersions} from "../controllers/dashboardController.js";


router.post('/create/:workspaceId/:userId', createDashboard);
router.get('/getdashboard/:workspaceId', getDashboard);
router.get('/getdashboard/:dashboardId', getDashboardById);
router.put('/updatedashboard/:dashboardId/:userId', updateDashboard);
router.delete('/deletedashboard/:dashboardId/:userId', deleteDashboard);

router.get('/getdashboardversion/:dashboardId',getDashboardVersions);

export default router;
