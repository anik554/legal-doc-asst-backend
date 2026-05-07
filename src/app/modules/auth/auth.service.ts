import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import StatusCode from "http-status";
import bcrypt from "bcryptjs";
import { createNewAceesTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";

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
  const newAccessToken = await createNewAceesTokenWithRefreshToken(refreshToken)
  return {accessToken: newAccessToken}
}

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken
};
