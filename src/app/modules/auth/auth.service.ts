import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import StatusCode from "http-status";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExist = await User.findOne({ email }).select("+password");;

  if (!isUserExist) {
    throw new AppError("User does not exist", StatusCode.UNAUTHORIZED);
  }

  const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password);

  if(!isPasswordMatched){
    throw new AppError("Password does not matched", StatusCode.BAD_REQUEST)
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role
  }

  const accessToken = jwt.sign(jwtPayload, "jwtsecret", { expiresIn : "1d" })

  return {
    email: isUserExist.email,
    accessToken
  }
};

export const AuthServices = {
  credentialsLogin,
};
