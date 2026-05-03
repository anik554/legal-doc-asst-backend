import { Request, Response } from "express"
import StatusCode from "http-status"

const notFound = (req: Request, res: Response) => {
    res.status(StatusCode.NOT_FOUND).json({
        success: false,
        message: "Route not found"
    })
}

export default notFound;