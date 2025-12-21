import express from 'express'
import authRoutes from './routes/auth.js'
import { connectKafka } from './producer.js';
import cors from 'cors';

const app = express()

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://nexthire-gamma.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json()) // Middleware to parse JSON bodies

connectKafka();

app.use("/api/auth", authRoutes);

export default app