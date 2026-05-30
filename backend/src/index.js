import express from "express"; // Web framweork to build api pretty quickly
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.route.js";
import { connectDb } from "./lib/db.js/connectDb.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

import path from "path";

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

if ((process.env.NODE_ENV = "production")) {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

server.listen(PORT, () => {
  connectDb();
  console.log(`Server running on port ${PORT}`);
});
