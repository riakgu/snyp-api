import { Router } from "express";
import linkController from "../controllers/link.controller.js";
import {optionalAuth, requireAuth} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", optionalAuth, linkController.createLink);
router.get('/:shortCode', linkController.getLinkByShortCode);
router.patch('/:shortCode', requireAuth, linkController.updateLink);

export default router;
