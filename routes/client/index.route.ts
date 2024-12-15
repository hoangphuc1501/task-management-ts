import { Express } from "express";
import {taskRoute} from "./task.route";
// const userMiddleware = require("../../middlewares/client/auth.middleware");

export const routeClient = (app: Express): void =>{

    app.use("/tasks", taskRoute); 
}