import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRouters } from "../modules/auth/auth.route";

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
]

moduleRouters.forEach(( route ) => {
    router.use(route.path, route.route);
});