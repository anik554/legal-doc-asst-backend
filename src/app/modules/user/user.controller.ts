import { Request, Response } from "express";
import StatusCode from "http-status";
import { UserServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  const user = await UserServices.createUser(req.body);

  res.status(StatusCode.CREATED).json({
    statusCode: StatusCode.CREATED,
    success: true,
    message: "User Created Successfully!",
    data: user,
  });
};

const getUsers = async (req: Request, res: Response) => {
  const users = await UserServices.getUsers();
  
  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    success: true,
    message: "Users retrieved successfully!",
    data: users,
  });
};

export const UserControllers = {
  createUser,
  getUsers,
};
