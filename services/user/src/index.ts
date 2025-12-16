import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/user.js'
import { connectKafka } from './producer.js'

dotenv.config()

connectKafka()

const app = express()

app.use(express.json())
app.use('/api/user', userRoutes)

app.listen(process.env.PORT, () => {
    console.log(`User service running on port ${process.env.PORT}`);
})