import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB } from "./db/db.js";
import dotenv from "dotenv";
import cors from 'cors';
import leaveRoutes from "./routes/leaveRoutes.js";
import adminLeaveRoutes from "./routes/adminLeaveRoutes.js"; // Ensure this imports the correct routes for adminLeave
import workingRoutes from "./routes/workingRoutes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Connect to the database
connectDB();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Log incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Test route
app.get("/test", (req, res) => {
    res.json({ message: "Hello, World!" });
});

// Define routes
app.use("/api/leave", leaveRoutes);
app.use("/api/adminLeave", adminLeaveRoutes); // Fixed missing leading "/"
app.use("/api/working", workingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
