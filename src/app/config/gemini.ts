import {GoogleGenerativeAI} from "@google/generative-ai";
import { envVars } from "./env";

const genAI = new GoogleGenerativeAI(envVars.GEMINI_API_KEY)

export const getModel = () => {
    genAI.getGenerativeModel({model: "gemini-2.0-flash"})
}