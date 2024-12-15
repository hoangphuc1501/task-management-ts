"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeClient = void 0;
const task_route_1 = require("./task.route");
const user_route_1 = require("./user.route");
const auth_middleware_1 = require("../../middlewares/client/auth.middleware");
const routeClient = (app) => {
    app.use("/tasks", auth_middleware_1.requireAuth, task_route_1.taskRoute);
    app.use("/users", user_route_1.usersRoute);
};
exports.routeClient = routeClient;
