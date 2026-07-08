import Message from "../models/Message.js";


export default function registerChatSocket(io, socket) {

   // console.log(`${socket.user.name} connected`);

   console.log(`User connected:`);

   
    // Join Workspace
   
    socket.on("joinWorkspace", (workspaceId) => {

        socket.join(workspaceId);
        //.join(workspaceId) means the socket is joining a room with the name of workspaceId. This allows the server to send messages to all sockets in that room, which is useful for chat applications where you want to broadcast messages to all users in a specific workspace.
       //workspaceId is coming from the client side when the user joins a workspace. The client emits a "joinWorkspace" event with the workspaceId as the payload, and the server listens for this event and joins the socket to the corresponding room.


        //is .join a built in function of socket.io? Yes, .join is a built-in function of Socket.IO that allows a socket to join a specific room. Rooms are a way to group sockets together, so that messages can be broadcasted to all sockets in that room.
        //  When a socket joins a room, it can receive messages sent to that room, and it can also send messages to that room.
        console.log(`${socket.user.name} joined workspace ${workspaceId}`);

        socket.to(workspaceId).emit("userJoined", {
            userId: socket.user._id,
            name: socket.user.name
        });

    });

    //.to is used to send a message to all sockets in a specific room, except for the socket that is sending the message.
    //  In this case, when a user joins a workspace, the server emits a "userJoined" event to all other sockets in the same workspace room, notifying them that a new user has joined.
    
    //.on is used to listen for events from the client. In this case, the server is listening for a "joinWorkspace" event, which is emitted by the client when a user joins a workspace. When the server receives this event, it executes the callback function that joins the socket to the workspace room and emits a "userJoined" event to all other sockets in that room.
   
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
            // const populatedMessage = await Message.findById(savedMessage._id)
            //     .populate("sender", "name ");



            //Message.findById(savedMessage._id).populate("sender", "name email") is a Mongoose method that retrieves the saved message from the database and populates the sender field with the corresponding user details (name and email) from the User collection. This allows you to send the complete message object, 
            // including sender information, to all clients in the workspace.
            //explain with example: Let's say a user with the name "Alice" and email "alice@example.com" sends a message.
            // The server saves the message in the Message collection with a reference to Alice's user ID in the sender field. When the server retrieves the saved message using Message.findById(savedMessage._id).populate("sender", "name email"), it replaces the sender field (which contains Alice's user ID) with an object containing Alice's name and email.
            //  The populatedMessage object would look like this:
            // {
            //     _id: "messageId",
            //     workspaceId: "workspaceId",
            //     sender: {
            //         _id: "aliceUserId",
            //         name: "Alice",
            //         email: "alice@example.com"
            //     },
            //     message: "Hello, everyone!",
            //     createdAt: "2024-06-01T12:00:00Z",
            //     updatedAt: "2024-06-01T12:00:00Z"
            // }


            io.to(workspaceId).emit("receiveMessage", {
                name: socket.user.name,
                message: savedMessage.message,
                createdAt: savedMessage.createdAt
            });

            //what is difference between socket.emit and io.emit? socket.emit sends a message to the specific socket that triggered the event, while io.emit sends a message to all connected sockets. In this case, io.to(workspaceId).emit sends the message to all sockets in the specified workspace room, allowing all users in that workspace to receive the new message.
           //what is difference between io.to and socket.to? io.to sends a message to all sockets in the specified room, while socket.to sends a message to all sockets in the specified room except for the socket that triggered the event. In this case, io.to(workspaceId).emit sends the message to all users in the workspace, while socket.to(workspaceId).emit would send the message to all users in the workspace except for the user who sent the message.

           //what is difference between .emit and .to ? .emit is used to send an event with data to a specific socket or room, while .to is used to specify the room to which the event should be sent. In this case, io.to(workspaceId).emit sends the "receiveMessage" event with the message data to all sockets in the specified workspace room.
        
      


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
            name: socket.user.name
        });

    });

    
    // Stop Typing
    
    socket.on("stopTyping", ({ workspaceId }) => {

        socket.to(workspaceId).emit("stopTyping", {
            name: socket.user.name
        });

    });

    
    // Disconnect
    
    socket.on("disconnect", () => {

       // console.log(`${socket.user.name} disconnected`);

       console.log(`User disconnected:`);

    });

}