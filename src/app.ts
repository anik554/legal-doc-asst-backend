import express, { Request, Response } from "express";
import StatusCode from 'http-status';
import cors from "cors";
import { router } from "./app/router";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors())

app.use("/api/v1", router)

app.get("/", (req: Request, res: Response)=> {
    res.status(StatusCode.OK).json({
        success: true,
        message: "Welcome to Legal Document Asistant System Backend",
        version: "1.0.0",
    })
})

app.use(globalErrorHandler);
app.use(notFound);

export default app;