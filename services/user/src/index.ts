import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/user.js'
import { connectKafka } from './producer.js'
import cors from 'cors'

dotenv.config()

connectKafka()

const app = express()

app.use(cors());
app.use(express.json())
app.use('/api/user', userRoutes)

app.listen(process.env.PORT, () => {
    console.log(`User service running on port ${process.env.PORT}`);
})