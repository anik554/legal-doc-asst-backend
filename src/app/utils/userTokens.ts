import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "../shared/jwt";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelpers/AppError";
import { ActiveTypes } from "../interfaces";
import StatusCode from "http-status";

export const createUserTokens = (isUserExist: Partial<IUser>) => {
  const jwtPaylod = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const accessToken = generateToken(
    jwtPaylod,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_EXPIRES
  );
  const refreshToken = generateToken(
    jwtPaylod,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRSH_EXPIRES
  );
  return { accessToken, refreshToken };
};

export const createNewAceesTokenWithRefreshToken = async (refreshToken: string) => {

  if(!refreshToken){
    throw new AppError("Refresh token not found", StatusCode.UNAUTHORIZED)
  }

  const token = refreshToken.startsWith("Bearer ")
    ? refreshToken.split(" ")[1]
    : refreshToken;

  const verifiedRefreshToken = verifyToken(token, envVars.JWT_REFRESH_SECRET) as JwtPayload;
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
  return accessToken
}