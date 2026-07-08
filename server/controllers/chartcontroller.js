import Chart from "../models/Chart.js";
import Dashboard from "../models/dashboard.js";
import Dataset from "../models/datasets.js";
import User from "../models/user.js";

export const createChart = async (req, res) => {
  
  try {
    const { dashboardId, userId,datasetId } = req.params;
    const dashboard = await Dashboard.findById(dashboardId);
    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: "Dashboard not found"
      });
    }
    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      return res.status(404).json({
        success: false, 
        message: "Dataset not found"
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found"
      });
    }

    if(user.role==='viewer'){
      return res.status(403).json({
        success: false,
        message: "You are not allowed to create chart"
      });
    }


    const {
      title,
      chartType,
      xaxis,
      yaxis,
      filters = []
    } = req.body;

    if (!title ||  !chartType || !xaxis || !yaxis) {
      return res.status(400).json({
        success: false,
        message: "title,  chartType, xaxis, and yaxis are required"
      });
    }

    
   const newChart=new Chart({
       title,
       dashboardId,
       datasetId,
       chartType,
        xaxis,
        yaxis,
        filters,
        createdBy:userId
   })

   await newChart.save();
   await Dashboard.findByIdAndUpdate(dashboardId,{$push:{charts:newChart._id}});

    return res.status(201).json({
      success: true,
      message: "Chart created successfully",
      chart: newChart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getChartById = async (req, res) => {
  try {
    const { chartId } = req.params;

    const chart = await Chart.findById(chartId)
      

    if (!chart) {
      return res.status(404).json({
        success: false,
        message: "Chart not found"
      });
    }

    return res.status(200).json({
      success: true,
      chart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getChartsByDashboardId = async (req, res) => {
  try {
    const { dashboardId } = req.params;

    const charts = await Chart.find({ dashboardId })
      

      if(charts.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No charts found for this dashboard"
        });
      }

    return res.status(200).json({
      success: true,
      count: charts.length,
      charts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const updateChartById = async (req, res) => {
  try {
    const { dashboardId,chartId } = req.params;
    const { title, chartType, xaxis,yaxis } = req.body;
    

    //filters need to be handled separately,

    const chart = await Chart.findById(chartId);

    if (!chart) {
      return res.status(404).json({
        success: false,
        message: "Chart not found"
      });
    }

    const updateData = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "title must be a non-empty string"
        });
      }
      updateData.title = title.trim();
    }

    if (chartType !== undefined) {
      const allowedChartTypes = ["bar", "pie", "line", "histogram"];
      if (!allowedChartTypes.includes(chartType)) {
        return res.status(400).json({
          success: false,
          message: "chartType must be one of: " + allowedChartTypes.join(", ")
        });
      }
      updateData.chartType = chartType;
    }

    if (xaxis !== undefined) {
      updateData.xaxis = xaxis;
    }

    if (yaxis !== undefined) {
      updateData.yaxis = yaxis;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update"
      });
    }

    const updatedChart = await Chart.findByIdAndUpdate(
      chartId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Chart updated successfully",
      chart: updatedChart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteChart = async (req, res) => {
  try {
    const { dashboardId,chartId } = req.params;

    const chart = await Chart.findById(chartId);

    const dashboard = await Dashboard.findById(dashboardId);

    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: "Dashboard not found"
      });
    }

    if (!chart) {
      return res.status(404).json({
        success: false,
        message: "Chart not found"
      });
    }

    await Chart.findByIdAndDelete(chartId);

    await Dashboard.findByIdAndUpdate(dashboardId, {
      $pull: { charts: chartId }
    });
    //this will remove the chartId from the charts array in the dashboard document
    //$pull operator removes from an existing array all instances of a value or values that match a specified condition.



    return res.status(200).json({
      success: true,
      message: "Chart deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};