import { Router } from "express";
import linkController from "../controllers/link.controller.js";
import {optionalAuth} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", optionalAuth,linkController.createLink);

export default router;
