import { Request, Response } from "express";
import StatusCode from "http-status";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";

const createUser = async (req: Request, res: Response) => {
  const user = await UserServices.createUser(req.body);

  sendResponse(res, {
    statusCode: StatusCode.CREATED,
    success: true,
    message: "User Created Successfully!",
    data: user,
  })
};

const updateUser = async (req: Request, res: Response)=>{
  const userId = req.params.id;
  const verfiedToken = req.user;
  // const token = req.headers.authorization || req.headers.cookie;
  // const verfiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
  const payload= req.body;
  const user = await UserServices.updateUser(userId as string, payload, verfiedToken)

  sendResponse(res, {
    statusCode: StatusCode.OK,
    success: true,
    message: "Users Updated successfully!",
    data: user,
  })
}

const getUsers = async (req: Request, res: Response) => {
  const users = await UserServices.getUsers();

  sendResponse(res, {
    statusCode: StatusCode.OK,
    success: true,
    message: "Users retrieved successfully!",
    data: users,
  })
};

export const UserControllers = {
  createUser,
  getUsers,
  updateUser
};
