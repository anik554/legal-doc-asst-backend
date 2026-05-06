import { Request, Response } from "express";
import StatusCode from "http-status";
import { AuthServices } from "./auth.service";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";

const credentialsLogin = async (req: Request, res: Response) => {
  const loginInfo = await AuthServices.credentialsLogin(req.body);

  res.cookie("accessToken", loginInfo.accessToken, {
    httpOnly: true,
    secure: false
  })

  res.cookie("refreshToken", loginInfo.refreshToken, {
    httpOnly: true,
    secure: false
  })

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    success: true,
    message: "User Logged in Successfully!",
    data: loginInfo,
  });
};

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  
  if(!refreshToken){
    throw new AppError("No Refresh Token Found", StatusCode.NOT_FOUND)
  }

  const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

  sendResponse(res, {
    statusCode: StatusCode.OK,
    success: true,
    message: "New Access Token Generate Successfully!",
    data: tokenInfo,
  })
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken
}