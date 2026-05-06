import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "../shared/jwt";

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
