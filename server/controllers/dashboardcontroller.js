import mongoose from 'mongoose';
import {randomUUID} from 'crypto';

import Dashboard from '../models/dashboard.js';

import Workspace from '../models/workspace.js';

import Chart from '../models/Chart.js';

import User from '../models/user.js';



// 





//  Build chart snapshot array used in version history


async function buildChartSnapshot(charts) {
    if(!Array.isArray(charts) || charts.length === 0) {
        return [];
    }

    const docs = await Chart.find({ _id: { $in: charts } }).lean(); //this line fetches all Chart documents whose _id is in the chartIds array and returns them as plain JavaScript objects (not Mongoose documents) because of the .lean() method. This is more efficient when you don't need Mongoose document methods.
    return docs.map((doc) =>{
        const clean={...doc};
        delete clean.data;
        delete clean.options;
        return clean;

    });

    //this return statement
}


// Generic access checker for dashboard + workspace role



// Create dashboard (editor/admin)
export async function createDashboard(req, res) {
    try{
        const {workspaceId,userId }= req.params;

        const workspace=await Workspace.findById(workspaceId);
        if(!workspace){
            return res.status(404).json({message:'Workspace not found'});
        }

        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        const {name,description=''} = req.body;

        if(!name){
            return res.status(400).json({message:'Name is required'});
        }

        

      


        if( user.role==='viewer'){
            return res.status(403).json({message:'You are not allowed to create dashboard in this workspace'});
        }

        const newDashboard = new Dashboard({
            name,
            description,
            workspaceId,
            createdBy: userId,
            charts:[],
            versionhistory:[],
        });

        await newDashboard.save();
        await Workspace.findByIdAndUpdate(workspaceId, {$push: {dashboards: newDashboard._id}});
        
        return res.status(201).json({
            message: 'Dashboard created successfully',
            dashboard: newDashboard
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:'Internal server error'});
    }


    };


//      GET /api/dashboards?workspaceId=...
//   List dashboards in one workspace (viewer+)
export async function getDashboard(req, res) {
            try{
            
                const {workspaceId} = req.params;

                if(!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)){
                    return res.status(400).json({message:'Invalid workspaceId'});
                }

               
               
                const dashboards=await Dashboard.find({workspaceId})
                .sort({updatedAt:-1})
                .select('-versionHistory') //this line will exclude the versionhistory field from the returned documents, which can help reduce the amount of data sent over the network and improve performance, especially if the versionhistory field contains a large amount of data.
                return res.status(200).json({message:"Dashboards found", dashboards});
            }
            catch(err){
                console.error(err);
                return res.status(500).json({message:'Internal server error'});

            }
        };


    //   GET /api/dashboards/:id
//   Fetch one dashboard with charts (viewer+)

export async function getDashboardById(req, res) {
    try{
       
        const {dashboardId} = req.params;

        if(!mongoose.Types.ObjectId.isValid(dashboardId)){
            return res.status(400).json({message:'Invalid dashboard id'});
        }


        
        

       
// dashboard found and user has permission, populate charts and createdBy

        const dashboard=await Dashboard.findById(dashboardId)
        

            if(!dashboard){
                return res.status(404).json({message:'Dashboard not found'});
            }

            return res.status(200).json({message:"Dashboard found", dashboard});
        }
        
        catch(err){
            console.error(err);
            return res.status(500).json({message:'Internal server error'});
        }
    };
    //not yet checked.

//         PATCH /api/dashboards/:id
//   Update metadata and save version snapshot (editor/admin)


export async function updateDashboard(req, res) {
    try{
         const {dashboardId,userId} = req.params;
        const {name, description, charts,saveVersion=true} = req.body;
        if(!mongoose.Types.ObjectId.isValid(dashboardId)){
            return res.status(400).json({message:'Invalid dashboard id'});
        }
        
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        if(user.role==='viewer'){
            return res.status(403).json({message:'You are not allowed to update dashboard'});
        }
       
       const dashboard=await Dashboard.findById(dashboardId);
        if(!dashboard){
            return res.status(404).json({message:'Dashboard not found'});
        }

        if(name) dashboard.name=name;
        if(description) dashboard.description=description;
        if(charts && Array.isArray(charts)) dashboard.charts=charts; 
       

        if(saveVersion){
            const chartSnapshot=await buildChartSnapshot(dashboard.charts);
            dashboard.versionHistory.push({
                
                savedAt:new Date(),
                savedBy:userId,
                chartSnapshot:chartSnapshot,
            });
        }
        await dashboard.save();
        return res.status(200).json({message:'Dashboard updated', dashboard});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:'Internal server error'});
        }
    };


//       DELETE /api/dashboards/:id
//   Delete dashboard and its charts (admin only)

export async function deleteDashboard(req, res) {

    try{
       const{dashboardId,userId}=req.params;
        if(!mongoose.Types.ObjectId.isValid(dashboardId)){
            return res.status(400).json({message:'Invalid dashboard id'});
        }

        const dashboard=await Dashboard.findById(dashboardId);
        if(!dashboard){
            return res.status(404).json({message:'Dashboard not found'});
        }
          
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        if(user.role!=='admin'){
            return res.status(403).json({message:'You are not allowed to delete dashboard'});
        }
      

        

        await Chart.deleteMany({_id:{$in:dashboard.charts},dashboard:dashboard._id});
        await Dashboard.deleteOne({_id:dashboard._id});
        return res.status(200).json({message:'Dashboard and its charts deleted successfully'});
    }

    catch(err){
        console.error(err);
        return res.status(500).json({message:'Internal server error'});
    }
};


// GET /api/dashboards/:id/versions
//   Fetch version history (viewer+)

export async function getDashboardVersions(req, res) {
    try{
        const {dashboardId} = req.params;
        if(!mongoose.Types.ObjectId.isValid(dashboardId)){
            return res.status(400).json({message:'Invalid dashboard id'});
        }
       



        
        const dashbard=await Dashboard.findById(dashboardId).select('versionHistory');

        if(!dashbard){
            return res.status(404).json({message:'Dashboard not found'});
        }

     

        return res.status(200).json({message:"Dashboard versions fetched successfully", versions: dashbard.versionHistory || []});

    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:'Internal server error'});
    }
};

