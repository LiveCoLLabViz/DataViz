


export default function registerChartSocket(io, socket) {

    // =========================================
    // Join Dashboard Room
    // =========================================

    socket.on("joinDashboard", (dashboardId) => {

        socket.join(dashboardId);

        console.log(`${socket.user.name} joined dashboard ${dashboardId}`);

    });

    // =========================================
    // Leave Dashboard Room
    // =========================================
    socket.on("leaveDashboard", (dashboardId) => {

        socket.leave(dashboardId);

        console.log(`${socket.user.name} left dashboard ${dashboardId}`);

    });

    // =========================================
    // Chart Created
    // =========================================
    socket.on("chart:created", ({ dashboardId, chart }) => {

        io.to(dashboardId).emit("chart:created", chart);

    });

    // =========================================
    // Chart Updated
    // =========================================
    socket.on("chart:updated", ({ dashboardId, chart }) => {

        io.to(dashboardId).emit("chart:updated", chart);

    });

    // =========================================
    // Chart Deleted
    // =========================================
    socket.on("chart:deleted", ({ dashboardId, chartId }) => {

        io.to(dashboardId).emit("chart:deleted", {
            message: `Chart with ID ${chartId} has been deleted`,
        });

    });

    // =========================================
    // Filters Updated
    // =========================================
    socket.on("chart:filterUpdated", ({ dashboardId, chart }) => {

        io.to(dashboardId).emit("chart:filterUpdated", chart);

    });

    // =========================================
    // Chart Type Changed
    // =========================================
    socket.on("chart:typeChanged", ({ dashboardId, chart }) => {

        io.to(dashboardId).emit("chart:typeChanged", chart);

    });

    // =========================================
    // User Started Editing
    // =========================================
    socket.on("chart:editing", ({ dashboardId, chartId }) => {

        socket.to(dashboardId).emit("chart:editing", {

            chartId,

            user: {

                id: socket.user._id,

                name: socket.user.name

            }

        });

        // when one user is editing a chart , I want to all others user to see his name ?
        //how to do that ? you can achieve this by emitting an event to all other users in the dashboard room when a user starts editing a chart. In the "chart:editing" event handler, you can send the user's name along with the chartId to all other users in the room using socket.to(dashboardId).emit. This way, all other users will receive the event and can display the name of the user who is currently editing the chart.
       //example code snippet:



    });

    // =========================================
    // User Stopped Editing
    // =========================================
    socket.on("chart:stopEditing", ({ dashboardId, chartId }) => {

        socket.to(dashboardId).emit("chart:stopEditing", {

            chartId,

            name: socket.user.name

        });

    });

}