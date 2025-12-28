import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import analyticsController from "../controllers/analytics.controller.js";

const router = Router();

router.get('/overview', requireAuth, analyticsController.getOverview);
router.get('/clicks', requireAuth, analyticsController.getClicks);
router.get('/top-links', requireAuth, analyticsController.getTopLinks);
router.get('/referrers', requireAuth, analyticsController.getReferrers);
router.get('/devices', requireAuth, analyticsController.getDevices);
router.get('/browsers', requireAuth, analyticsController.getBrowsers);

export default router;