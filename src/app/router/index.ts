import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRouters } from "../modules/auth/auth.route";
import { DocumentRouters } from "../modules/document/document.routes";

export const router = Router();

const moduleRouters = [
    {
        path : "/user",
        route: UserRoutes
    },
    {
        path : "/auth",
        route: AuthRouters
    },
    {
        path : "/document",
        route: DocumentRouters
    },
]

moduleRouters.forEach(( route ) => {
    router.use(route.path, route.route);
});