import dotenv from "dotenv";
import express from "express";
dotenv.config();
import cors from "cors";
import authRoutes from "./routes/auth.js";
import urlRoute from "./routes/urlRoute.js";
import connectDB from "./config/database.js";
import analytics from './routes/analytics.js'

const app = express();

connectDB();
// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoute);
app.use("/api/analytics", analytics);


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
