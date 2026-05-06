import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import StatusCode from "http-status";
import bcrypt from "bcryptjs";
import { createUserTokens } from "../../utils/userTokens";
import { generateToken, verifyToken } from "../../shared/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { ActiveTypes } from "../../interfaces";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExist = await User.findOne({ email }).select("+password");

  if (!isUserExist) {
    throw new AppError("User does not exist", StatusCode.UNAUTHORIZED);
  }

  const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password);

  if(!isPasswordMatched){
    throw new AppError("Password does not matched", StatusCode.BAD_REQUEST)
  }

  const userTokes = createUserTokens(isUserExist)
  const userData = await User.findOne({ email }).select("-password").lean();

  return {
    accessToken: userTokes.accessToken,
    refreshToken: userTokes.refreshToken,
    user:userData
  }
};

const getNewAccessToken = async(refreshToken: string)=>{
  const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;
  const isUserExist = await User.findOne({email: verifiedRefreshToken.email})

  if(!isUserExist){
    throw new AppError("User does not exist", StatusCode.NOT_FOUND)
  }

  if(isUserExist.isActive === ActiveTypes.BLOCKED || isUserExist.isActive === ActiveTypes.INACTIVE){
    throw new AppError("User is Blocked or Inactive", StatusCode.BAD_REQUEST)
  }

  if(isUserExist.isDeleted){
    throw new AppError("User is Deleted", StatusCode.NOT_FOUND)
  }

  const payload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role
  }

  const accessToken = generateToken(payload, envVars.JWT_ACCESS_SECRET, envVars.JWT_EXPIRES)

  return {accessToken}


}

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken
};
