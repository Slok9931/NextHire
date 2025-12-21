import express from 'express'
import jobRoutes from './routes/job.js'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: ["http://localhost:3000", "https://nexthire-gamma.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use('/api/job', jobRoutes)

export default app