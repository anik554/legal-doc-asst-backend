import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import StatusCode from "http-status";
import { verifyToken } from "../shared/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...authRoles: string[])=> async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const accessToken = req.headers.authorization || req.headers.cookie
        if(!accessToken){
            throw new AppError("No Token Received", StatusCode.NOT_FOUND)
        }
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload
        if (!verifiedToken || !verifiedToken.role) {
        throw new AppError("Invalid token payload", StatusCode.UNAUTHORIZED);
        }
        
        if(!authRoles.includes(verifiedToken.role)){
            throw new AppError("You are not permitted to view this route!!", StatusCode.UNAUTHORIZED)
        }
        req.user = verifiedToken
        next()

    } catch (error) {
        next(error)
    }
}