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

const app = express()

// middleware
app.use(morgan('dev'))
app.use(express.json())

// routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/review', reviewRoutes)
app.use('api/order', orderRoutes)
app.use('/api/message', messageRoutes);
app.use('/api/gig/', gigRoutes),
app.use('/api/conversation', conversationRoutes)

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