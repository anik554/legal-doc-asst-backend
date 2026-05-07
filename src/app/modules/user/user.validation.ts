import z from "zod";
import { ActiveTypes, Role } from "../../interfaces";

export const createUserZodSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" }),

  email: z
    .string({ error: "Email is required" })
    .email({ message: "Invalid email address" }),

  password: z
    .string({ error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password cannot exceed 100 characters" }),

  phone: z
    .string()
    .min(7, { message: "Phone number is too short" })
    .max(15, { message: "Phone number is too long" })
    .optional(),

  avatar: z.string().url({ message: "Avatar must be a valid URL" }).optional(),
  role: z.enum(Object.values(Role)).optional(),

  address: z
    .string()
    .max(200, { message: "Address cannot exceed 200 characters" })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" })
    .optional(),

  email: z.string().email({ message: "Invalid email address" }).optional(),

  phone: z
    .string()
    .min(7, { message: "Phone number is too short" })
    .max(15, { message: "Phone number is too long" })
    .optional(),

  avatar: z.string().url({ message: "Avatar must be a valid URL" }).optional(),

  address: z
    .string()
    .max(200, { message: "Address cannot exceed 200 characters" })
    .optional(),

  isActive: z.enum(Object.values(ActiveTypes)).optional(),

  isDeleted: z.boolean().optional(),

  isVerified: z.boolean().optional(),
});
