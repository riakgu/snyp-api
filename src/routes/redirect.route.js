import { Router } from "express";
import linkController from "../controllers/link.controller.js";

const router = Router();

router.get('/:shortCode', linkController.redirectLink);

export default router;
