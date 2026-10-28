import express from 'express';
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./src/routes/auth.routes.js"
const app = express();

app.use(cors({
    origin:"*",
    credentials:true
}))

app.use(express.json());
app.use(cookieParser())


app.use("/api",authRoutes)

export default app;
