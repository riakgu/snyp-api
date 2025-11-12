import statsService from "../services/stats.service.js";

async function getLinkStats(req, res, next){
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
    getLinkStats,
}