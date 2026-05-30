import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.route.js";
import { connectDb } from "./lib/db.js/connectDb.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";
import { fileURLToPath } from "url"; 

// 👇 ADD THESE TWO LINES - Creates __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

const PORT = process.env.PORT || 5001;

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend in production
const distPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(distPath));

// Catch-all route for SPA
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

server.listen(PORT, () => {
  connectDb();
  console.log(`Server running on port ${PORT}`);
});
