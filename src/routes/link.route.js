import { Router } from "express";
import linkController from "../controllers/link.controller.js";
import {optionalAuth, requireAuth} from "../middlewares/auth.middleware.js";
import qrController from "../controllers/qr.controller.js";

const router = Router();

router.post("/", optionalAuth, linkController.createLink);
router.get('/:shortCode', linkController.getLinkByShortCode);
router.patch('/:shortCode', requireAuth, linkController.updateLink);
router.delete('/:shortCode', requireAuth, linkController.deleteLink);
router.get('/', requireAuth, linkController.getLinks);

router.get('/:shortCode/qr', qrController.getQRCode);
router.get('/:shortCode/qr/download', qrController.downloadQRCode);

export default router;
