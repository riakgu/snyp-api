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
router.get('/countries', requireAuth, analyticsController.getCountries);
router.get('/cities', requireAuth, analyticsController.getCities);

router.get('/clicks/export', requireAuth, analyticsController.exportClicks);
router.get('/top-links/export', requireAuth, analyticsController.exportTopLinks);
router.get('/referrers/export', requireAuth, analyticsController.exportReferrers);
router.get('/devices/export', requireAuth, analyticsController.exportDevices);
router.get('/browsers/export', requireAuth, analyticsController.exportBrowsers);
router.get('/countries/export', requireAuth, analyticsController.exportCountries);
export default router;