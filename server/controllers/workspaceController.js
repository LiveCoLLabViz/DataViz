import User from '../models/user.js';
import Workspace from '../models/workspace.js';

export const createWorkspace=async(req,res)=>{
    try {
        const {userId}=req.params;
        

        const user=await User.findById(userId);

        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }

        if(user.role!=="admin"){
            return res.status(403).json({
                message:"Only admin can create workspace"
            })
        }

        

        const {name,description=""}=req.body;

        if(!name){
            return res.status(400).json({
                message:"Workspace name is required"
            })
        }
        

        const workspace=new Workspace({
            name,
            description,
            createdBy:userId,
            members:[userId],
            createdAt:new Date()

        })
        await workspace.save();
        res.status(201).json(workspace);
    } catch (error) {
        res.status(500).json({ message: "Error creating workspace", error });
    }
}


export const getWorkspace=async(req,res)=>{
    const {workspaceId}=req.params;
    try {
        const workspace=await Workspace.findById(workspaceId);

        if(!workspace){
            return res.status(404).json({
                message:"Workspace not found"
            })
        }
        return res.status(200).json({
            message:"Workspace found",
            workspace
        }  );
    } catch (error) {
        res.status(500).json({ message: "Error fetching workspace", error });   
    }
}

export const deleteWorkspace=async(req,res)=>{
    const {workspaceId,userId}=req.params;

    try{
          const workspace=await Workspace.findByIdAndDelete(workspaceId);

          if(!workspace){
            return res.status(404).json({
                message:"Workspace not found"
            })
          }
          
          const user= await User.findById(userId);
          if(!user){
            return res.status(404).json({
                message:"User not found"
            })
          }

            if(user.role!=="admin"){
                return res.status(403).json({
                    message:"Only admin can delete workspace"
                })
            }

            return res.status(200).json({
                message:"Workspace deleted successfully",
                workspace
            })
        
    }
    catch(error){

    }
}

