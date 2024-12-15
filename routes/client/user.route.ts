import express, { Express } from "express";
const router = express.Router();

import * as controller from "../../controllers/client/user.controller";

router.post("/register", controller.register);
// router.post("/login", controller.login)
// router.post("/password/forgot", controller.forgotPassword)
// router.post("/password/otp", controller.otpPassword)
// router.post("/password/reset", controller.resetPassword)
// router.get("/profile", controller.profile)
export const usersRoute = router;