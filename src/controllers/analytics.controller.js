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

async function getTopLinks(req, res, next) {
    try {
        const result = await analyticsService.getTopLinks(req);
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
}

async function getReferrers(req, res, next) {
    try {
        const result = await analyticsService.getReferrers(req);
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
}

async function getDevices(req, res, next) {
    try {
        const result = await analyticsService.getDevices(req);
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
}

async function getBrowsers(req, res, next) {
    try {
        const result = await analyticsService.getBrowsers(req);
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
}

export default {
    getOverview,
    getClicks,
    getTopLinks,
    getReferrers,
    getDevices,
    getBrowsers,
};