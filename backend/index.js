import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js"
import userRouter from "./routes/user.route.js";
import interviewRouter from "./routes/interview.route.js";
import userAnswerRouter from "./routes/userAnswer.route.js"
import resumeRouter from "./routes/resume.route.js";
dotenv.config();
connectDB();
const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions={
origin:'http://localhost:5174',
credentials:true  
}
app.use(cors(corsOptions));
app.use("/user",userRouter);
app.use("/interview",interviewRouter);
app.use("/userAnswer",userAnswerRouter);
app.use("/resume",resumeRouter);
const PORT=8000;
app.listen(PORT,()=>{
 console.log(`Server listen on http://localhost${PORT}`);   
})