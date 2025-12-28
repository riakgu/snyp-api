import analyticsService from "../services/analytics.service.js";

async function getOverview(req, res, next) {
    try {
        const result = await analyticsService.getOverview(req);
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
}

async function getClicks(req, res, next) {
    try {
        const result = await analyticsService.getClicks(req);
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
}

export default {
    getOverview,
    getClicks,
};