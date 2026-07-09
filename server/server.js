import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv'
import ConnectDB from './config/mongo.config.js';
import passport from './config/passportconfig.js';
import DatasetRoutes from './routes/datasetUpload.js';
import UserRoutes from './routes/auth.route.js';
// import chartRoutes from './routes/chart.route.js';
 import dashboardRoutes from './routes/dashboardroute.js';
 import workspaceRoutes from './routes/workspaceRoutes.js';
 //import setupSocket from './socket/index.js';
import initializeSocket from "./socket/socket.server.js"
import chartRoutes from './routes/chartRoutes.js';



dotenv.config();
ConnectDB();

const app=express()

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow any localhost origin or the specific CLIENT_URL
        if (origin.startsWith('http://localhost:') || origin === process.env.CLIENT_URL || origin === process.env.CORS_ORIGIN) {
            return callback(null, true);
        }
        
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize());


app.use('/api/dataset',DatasetRoutes);
app.use(UserRoutes);
app.use('/api/workspace',workspaceRoutes);
// app.use('/api/chart',chartRoutes);
 app.use('/api/dashboard',dashboardRoutes);
// app.use('/api/workspace',workspaceRoutes);
app.use('/api/chart',chartRoutes);



// Initilize socket server
 const PORT=process.env.PORT || 5000;
const server = initializeSocket(app);


server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});


