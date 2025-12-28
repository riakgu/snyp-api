import { Router } from "express";
import linkController from "../controllers/link.controller.js";
import { optionalAuth, requireAuth } from "../middlewares/auth.middleware.js";
import qrcodeController from "../controllers/qrcode.controller.js";
import statsController from "../controllers/stats.controller.js";

const router = Router();

router.get('/archived', requireAuth, linkController.getArchivedLinks);
router.post('/:shortCode/archive', requireAuth, linkController.archiveLink);
router.post('/:shortCode/restore', requireAuth, linkController.restoreLink);

router.post('/:shortCode/verify', linkController.verifyPasswordLink);

router.get('/stats', requireAuth, statsController.getTotalStats);
router.get('/', requireAuth, linkController.getLinks);
router.post("/", optionalAuth, linkController.createLink);
router.get('/:shortCode', linkController.getLinkByShortCode);
router.patch('/:shortCode', requireAuth, linkController.updateLink);
router.delete('/:shortCode', requireAuth, linkController.deleteLink);

router.get('/:shortCode/qr', qrcodeController.getQRCode);
router.get('/:shortCode/qr/download', qrcodeController.downloadQRCode);

router.get('/:shortCode/stats', statsController.getLinkStats);

export default router;
