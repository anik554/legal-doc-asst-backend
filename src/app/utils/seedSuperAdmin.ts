/* eslint-disable no-restricted-syntax */
import { envVars } from "../config/env"
import { AuthProvider, Role } from "../interfaces"
import { IUser } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"
import bcrypt from "bcryptjs"

export const seedSuperAdmin = async()=>{
    try {
        const isSuperAdminExist = await User.findOne({email: envVars.SUPER_ADMIN_EMAIL})
        if(isSuperAdminExist){
            console.log("Super Admin Already Exist")
            return;
        }
        console.log("Trying to create super admin...")
        const hashedPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.SOLT_ROUND))
        const authprovider: AuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_PASSWORD
        }
        const payload: IUser = {
            name: "Super admin",
            role: Role.SUPER_ADMIN,
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            auths: [authprovider],
            isVerified: true
        }
        const superAdmin = await User.create(payload)
        console.log("Super Admin Created Successfuly! \n")
        console.log(superAdmin)
    } catch (error) {
        console.error(error)
    }
}