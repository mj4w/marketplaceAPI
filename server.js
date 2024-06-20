import express from 'express'
import environment from './env.js'
import connectDB from './db/connect.js'
import morgan from 'morgan'
import notFound from './helpers/not-found.js'

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js'
import reviewRoutes from './routes/review.route.js';
import orderRoutes from './routes/order.route.js';
import messageRoutes from './routes/message.route.js';
import gigRoutes from './routes/gig.route.js';
import conversationRoutes from './routes/conversation.route.js';
import cookieParser from 'cookie-parser'
import { status } from './helpers/status.js'
import cors from 'cors'

const app = express()

// middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
}))

// routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/message', messageRoutes);
app.use('/api/gigs/', gigRoutes),
app.use('/api/conversation', conversationRoutes)

app.use((err,req,res,next) => {
    const errorMessage = err.message || "Something went wrong!";
    return res.status(status.error).send(errorMessage)
})

// route not found
app.use(notFound)

async function start(){
    const port = environment.port || 3000
    try {
        await connectDB(environment.mongo_uri);
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })
    } catch (error) {
        console.log(error)
    }
}
start()