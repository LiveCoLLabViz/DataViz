import express from 'express';
import { createChart, getChartById, getChartsByDashboardId, updateChartById, deleteChart } from '../controllers/chartcontroller.js';

const router = express.Router();

router.post('/create/:dashboardId/:userId/:datasetId',createChart);
router.get('/get/:chartId',getChartById);
router.get('/getcharts/:dashboardId',getChartsByDashboardId);
router.put('/update/:dashboardId/:chartId',updateChartById);
router.delete('/delete/:dashboardId/:chartId',deleteChart);

export default router;


