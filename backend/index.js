import express, {urlencoded} from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './utils/db.js';
import userRoute from './routes/userRoute.js'
import messageRoute from './routes/messageRoute.js'
import postRoute from './routes/postRoute.js'

dotenv.config({});
const app = express();
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
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE",],
    credentials: true
}))

// routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/message', messageRoute);

app.listen(PORT, ()=>{
    connectDB()
    console.log(`Server listening at port: ${PORT}`);
})