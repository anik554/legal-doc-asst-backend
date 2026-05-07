import { Request, Response } from "express";
import StatusCode from "http-status";
import { AuthServices } from "./auth.service";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";

const credentialsLogin = async (req: Request, res: Response) => {
  const loginInfo = await AuthServices.credentialsLogin(req.body);

  setAuthCookie(res, loginInfo)

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    success: true,
    message: "User Logged in Successfully!",
    data: loginInfo,
  });
};

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  
  if(!refreshToken){
    throw new AppError("No Refresh Token Found", StatusCode.NOT_FOUND)
  }

  const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

  setAuthCookie(res, tokenInfo)

  sendResponse(res, {
    statusCode: StatusCode.OK,
    success: true,
    message: "New Access Token Generate Successfully!",
    data: tokenInfo,
  })
})

const logout = catchAsync(async (req: Request, res: Response) => {

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })
  
  sendResponse(res, {
    statusCode: StatusCode.OK,
    success: true,
    message: "User Logged Out Successfull!",
    data: undefined,
  })
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout
}