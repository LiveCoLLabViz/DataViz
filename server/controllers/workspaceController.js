import User from '../models/user.js';
import Workspace from '../models/workspace.js';

export const createWorkspace = async (req, res) => {
    try {
        const { userId } = req.params;


        const { name, description = "" } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Workspace name is required"
            })
        }


        const workspace = new Workspace({
            name,
            description,
            createdBy: userId,
            members: [userId],
            createdAt: new Date()

        })
        await workspace.save();
        res.status(201).json(workspace);
    } catch (error) {
        res.status(500).json({ message: "Error creating workspace", error });
    }
}


export const getWorkspace = async (req, res) => {
    const { workspaceId } = req.params;
    try {
        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found"
            })
        }
        return res.status(200).json({
            message: "Workspace found",
            workspace
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching workspace", error });
    }
}

export const deleteWorkspace = async (req, res) => {
    const { workspaceId, userId } = req.params;

    try {
        const workspace = await Workspace.findByIdAndDelete(workspaceId);

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found"
            })
        }

        return res.status(200).json({
            message: "Workspace deleted successfully",
            workspace
        })

    }
    catch (error) {
        res.status(500).json({ message: "Error deleting workspace", error });
    }
}

export const getAllWorkspaces = async (req, res) => {
    const { userId } = req.params;
    try {
        // Fetch workspaces where the user is either the creator or a member
        const workspaces = await Workspace.find({
            $or: [{ createdBy: userId }, { members: userId }]
        }).sort({ createdAt: -1 });
        
        return res.status(200).json({
            message: "Workspaces fetched successfully",
            workspaces
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching workspaces", error });
    }
}
