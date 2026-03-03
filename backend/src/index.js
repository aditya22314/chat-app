import express from "express";  // Web framweork to build api pretty quickly 
import authRoutes from "./routes/auth.routes.js";
const app = express();

const PORT  = process.env.PORT || 5001;


app.use("/api/auth",authRoutes);

app.listen(PORT,()=> console.log(`Server running on port ${PORT}`))