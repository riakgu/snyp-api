import { Router } from "express";
import redirectController from "../controllers/redirect.controller.js";

const router = Router();

router.get('/:shortCode', redirectController.redirectLink);

export default router;
