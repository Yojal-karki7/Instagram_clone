import express, {urlencoded} from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './utils/db.js';
import userRoute from './routes/userRoute.js'
import messageRoute from './routes/messageRoute.js'
import postRoute from './routes/postRoute.js'
import storyRoute from './routes/storyRoutes.js'
import { app, server } from './socket.io/socket.js'

dotenv.config({});
const PORT = process.env.PORT || 3000;


app.get('/', (req, res)=>{
    return res.status(200).json({
        message: 'Siuuu',
        success: true,
    })
})

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended: true}))
app.use(cors({
    origin: ["https://instagram-clone-woad-xi.vercel.app/"],
    methods: ["GET", "POST", "PUT", "DELETE",],
    credentials: true
}))

// routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/message', messageRoute);
app.use('/api/v1/story', storyRoute);

server.listen(PORT, ()=>{
    connectDB()
    console.log(`Server listening at port: ${PORT}`);
})