import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authMiddleware, authController.logout);
router.get("/me", authMiddleware, authController.get);

export default router;
