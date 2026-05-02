import express, { Request, Response } from "express";
import StatusCode from 'http-status';
const app = express();

app.get("/", (req: Request, res: Response)=> {
    res.status(StatusCode.OK).json({
        message: "Welcome to Legal Document Asistant System Backend"
    })
})

export default app;