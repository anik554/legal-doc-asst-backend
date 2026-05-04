import { Request, Response } from "express";
import StatusCode from "http-status";
import { AuthServices } from "./auth.service";

const credentialsLogin = async (req: Request, res: Response) => {
  const loginInfo = await AuthServices.credentialsLogin(req.body);

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    success: true,
    message: "User Logged in Successfully!",
    data: loginInfo,
  });
};

export const AuthControllers = {
    credentialsLogin
}