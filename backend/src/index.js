import express from "express"; // Web framweork to build api pretty quickly
import authRoutes from "./routes/auth.routes.js";
import { connectDb } from "./lib/db.js/connectDb.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5001;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDb();
  console.log(`Server running on port ${PORT}`);
});
