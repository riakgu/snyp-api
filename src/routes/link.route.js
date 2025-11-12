import { Router } from "express";
import linkController from "../controllers/link.controller.js";
import {optionalAuth, requireAuth} from "../middlewares/auth.middleware.js";
import qrcodeController from "../controllers/qrcode.controller.js";
import statsController from "../controllers/stats.controller.js";

const router = Router();

router.post("/", optionalAuth, linkController.createLink);
router.get('/:shortCode', linkController.getLinkByShortCode);
router.patch('/:shortCode', requireAuth, linkController.updateLink);
router.delete('/:shortCode', requireAuth, linkController.deleteLink);
router.get('/', requireAuth, linkController.getLinks);

router.get('/:shortCode/qr', qrcodeController.getQRCode);
router.get('/:shortCode/qr/download', qrcodeController.downloadQRCode);

router.get('/:shortCode/stats', statsController.getLinkStats);

export default router;
