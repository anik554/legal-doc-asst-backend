import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import { ActiveTypes, Role } from "../../interfaces";

const authSchema = new Schema(
  {
    provider: { type: String, required: true },
    providerId: { type: String },
  },
  {
    _id: false,
    timestamps: false,
    versionKey: false,
  },
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    avatar: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    role:{type: String, default: Role.USER},
    isActive: {
      type: String,
      enum: Object.values(ActiveTypes),
      default: ActiveTypes.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    auths: [authSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model<IUser>("User", userSchema);
