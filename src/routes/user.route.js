import {Router} from "express";
import {requireAuth} from "../middlewares/auth.middleware.js";
import userController from "../controllers/user.controller.js";

const router = Router();

router.get("/me", requireAuth, userController.getProfile);
router.post('/me', requireAuth, userController.updateUser);
router.post('/me/password', requireAuth, userController.updatePassword);

export default router;