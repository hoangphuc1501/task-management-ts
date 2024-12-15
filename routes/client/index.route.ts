import { Express } from "express";
import {taskRoute} from "./task.route";
import { usersRoute } from "./user.route";

import { requireAuth } from "../../middlewares/client/auth.middleware";
export const routeClient = (app: Express): void =>{

    app.use("/tasks", requireAuth, taskRoute); 
    app.use("/users", usersRoute); 
}