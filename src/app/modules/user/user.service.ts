import AppError from "../../errorHelpers/AppError";
import { ActiveTypes, AuthProvider, Role } from "../../interfaces";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import StatusCode from "http-status";
import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs"
import { envVars } from "../../config/env";

export const createUser = async (payload: Partial<IUser>) => {

  const {email, password, ...rest} = payload;
  
  const isUserExist = await User.findOne({email})

  if(isUserExist){
    throw new AppError("User Already Exist", StatusCode.BAD_REQUEST);
  }

  const hashedPassword = await bcryptjs.hash(password as string, 10);

  const authProvider: AuthProvider = { provider: "credentials", providerId: email as string}

  await User.create({
    email,
    auths: [authProvider],
    password: hashedPassword,
    ...rest
  })

  const newUser = await User.findOne({email}).select("-password").lean();

  return newUser;
};

export const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload)=>{

  const isUserExist = await User.findById(userId)

  if(!isUserExist){
    throw new AppError("User Not Found", StatusCode.NOT_FOUND);
  }

  if(isUserExist.isDeleted || isUserExist.isActive === ActiveTypes.BLOCKED){
    throw new AppError("This user can not be update", StatusCode.FORBIDDEN);
  }

  if(payload.role){
    if(decodedToken.role === Role.USER){
      throw new AppError("You are not authorized",StatusCode.FORBIDDEN)
    }

    if(payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN){
      throw new AppError( "You are not authorized",StatusCode.FORBIDDEN)
    }
  }

  if(payload.isActive || payload.isDeleted || payload.isVerified){
    if(decodedToken.role === Role.USER){
      throw new AppError("You are not authorized", StatusCode.FORBIDDEN)
    }
  }
  if(payload.password){
    payload.password = await bcrypt.hash(payload.password, Number(envVars.SOLT_ROUND))
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators:true})
  return newUpdatedUser;
}

const getUsers = async () => {
  const users = await User.find({})
  return users
};

export const UserServices = {
  createUser,
  getUsers,
  updateUser
};
