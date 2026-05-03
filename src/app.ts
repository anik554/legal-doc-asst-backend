import express, { Request, Response } from "express";
import StatusCode from 'http-status';
import cors from "cors";
import { router } from "./app/router";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app = express();
app.use(express.json());
app.use(cors())

app.use("/api/v1", router)

app.get("/", (req: Request, res: Response)=> {
    res.status(StatusCode.OK).json({
        message: "Welcome to Legal Document Asistant System Backend"
    })
})

app.use(globalErrorHandler);
app.use(notFound);

export default app;