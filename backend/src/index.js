import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import {connectDB} from "./lib/db.js"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import interviewRoutes from "./routes/interview.routes.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
};

startServer();

