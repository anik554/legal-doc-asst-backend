import { ActiveTypes, AuthProvider, Role } from "../../interfaces";

export interface IUser {
    name: string;
    email: string;
    password: string;
    phone?: string;
    avatar?: string;
    address?: string;
    isDeleted?: boolean;
    isActive?: ActiveTypes;
    isVerified?: boolean;
    auths: AuthProvider[];
    role: Role;
}