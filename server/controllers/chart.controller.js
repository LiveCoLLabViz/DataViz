import Message from "../models/Message.js";

export default function registerChatSocket(io, socket) {

    console.log(`${socket.user.name} connected`);

   
    // Join Workspace
   
    socket.on("joinWorkspace", (workspaceId) => {

        socket.join(workspaceId);

        console.log(`${socket.user.name} joined workspace ${workspaceId}`);

        socket.to(workspaceId).emit("userJoined", {
            userId: socket.user._id,
            name: socket.user.name
        });

    });

   
    // Leave Workspace
   
    socket.on("leaveWorkspace", (workspaceId) => {

        socket.leave(workspaceId);

        socket.to(workspaceId).emit("userLeft", {
            userId: socket.user._id,
            name: socket.user.name
        });

    });

   
    // Send Message
    
    socket.on("sendMessage", async ({ workspaceId, message }) => {

        try {

            const savedMessage = await Message.create({
                workspaceId,
                sender: socket.user._id,
                message
            });

            // Populate sender details
            const populatedMessage = await Message.findById(savedMessage._id)
                .populate("sender", "name email");

            io.to(workspaceId).emit("receiveMessage", populatedMessage);

        } catch (error) {

            console.log(error);

            socket.emit("error", {
                message: "Unable to send message"
            });

        }

    });

   
    // Typing
   
    socket.on("typing", ({ workspaceId }) => {

        socket.to(workspaceId).emit("typing", {
            userId: socket.user._id,
            name: socket.user.name
        });

    });

    
    // Stop Typing
    
    socket.on("stopTyping", ({ workspaceId }) => {

        socket.to(workspaceId).emit("stopTyping", {
            userId: socket.user._id
        });

    });

    
    // Disconnect
    
    socket.on("disconnect", () => {

        console.log(`${socket.user.name} disconnected`);

    });

}