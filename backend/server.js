import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import cloudinary from "cloudinary";
import courseRouter from './routes/courseRoutes.js';
import orderRouter from './routes/orderRoute.js';
import notificationRouter from './routes/notificationRoutes.js';
import analyticsRouter from './routes/analyticsRoutes.js';
import layoutRouter from './routes/layoutRoutes.js';
import http from "http";
import { initSocketServer } from './serverSocket.js';

const app = express();
const server = http.createServer(app);

//middlewares
app.use(express.json({limit:'50mb'}));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express.urlencoded({extended:true}));

//routes
app.use('/api/v1', userRouter);
app.use('/api/v1', courseRouter);
app.use('/api/v1', orderRouter);
app.use('/api/v1', notificationRouter);
app.use('/api/v1', analyticsRouter);
app.use('/api/v1', layoutRouter);

//test route
app.get('/', (req,res)=>{
    res.send("API is Working!");
});

//error handling
app.use(errorMiddleware);

//cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

initSocketServer(server);
//server start
server.listen(process.env.PORT, ()=>{
    console.log(`Server Started on http://localhost:${process.env.PORT}`);
    
    //db
    connectDB();
});
