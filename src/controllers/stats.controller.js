import statsService from "../services/stats.service.js";

async function getTotalStats(req, res, next) {
    try {
        const result = await statsService.getTotalStats(req);
        res.status(200).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
}

async function getLinkStats(req, res, next) {
    try {
        const result = await statsService.getStats(req);
        res.status(200).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
}

export default {
    getTotalStats,
    getLinkStats,
}