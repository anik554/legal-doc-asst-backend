import AppError from "../../errorHelpers/AppError";
import { AuthProvider } from "../../interfaces";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import StatusCode from "http-status";
import bcryptjs from "bcryptjs";

export const createUser = async (payload: Partial<IUser>) => {

  const {email, password, ...rest} = payload;
  
  const isUserExist = await User.findOne({email})

  if(isUserExist){
    throw new AppError("User Already Exist", StatusCode.BAD_REQUEST);
  }

  const hashedPassword = await bcryptjs.hash(password as string, 10);

  const authProvider: AuthProvider = { provider: "credentials", providerId: email as string}

  const newUser = await User.create({
    email,
    auths: [authProvider],
    password: hashedPassword,
    ...rest
  })

  const {password: _, ...userWithoutPassword} = newUser.toObject();

  return userWithoutPassword;
};

const getUsers = async () => {
  const users = await User.find({})
  return users
};

export const UserServices = {
  createUser,
  getUsers,
};
