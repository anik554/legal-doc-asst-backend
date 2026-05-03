/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import StatusCode from "http-status";

export const createUser = async (payload: Partial<IUser>) => {
  try {
    const user = await User.create({
      ...payload,
      auths: [
        {
          provider: "credentials",
          providerId: "",
        },
      ],
    });
    user.auths[0].providerId = user._id.toString();
    await user.save();
    return user.toObject();
  } catch (error: any) {
    if (error?.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0];
      const value = error.keyValue?.[field];

      throw new AppError(
        `${field} "${value}" already exists`,
        StatusCode.BAD_REQUEST,
        error.stack,
      );
    }

    throw error;
  }
};

const getUsers = async () => {
  try {
    const users = await User.find();
    return users.map(user => user.toObject());
  } catch (error: any) {
    throw new AppError(
      "Failed to retrieve users",
      StatusCode.INTERNAL_SERVER_ERROR,
      error.stack,
    );
  }
};

export const UserServices = {
  createUser,
  getUsers,
};
