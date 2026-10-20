import express from "express";
import cors from "cors";
import authRouter from "./routers/authRoute.js";


const app = express();
app.use(express.json());
app.use(cors());

// Authentication routes
app.use("/api/auth", authRouter);
// app.use("/api/admin", adminRouter);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
