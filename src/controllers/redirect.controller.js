import linkService from "../services/link.service.js";
import statsService from "../services/stats.service.js";

async function redirectLink(req, res, next) {
    try {
        const result = await linkService.getLinkByShortCode(req);
        await linkService.validateLinkAccess(result);
        await linkService.verifyLinkPassword(result, req.query.password);
        await statsService.trackVisit(req);
        res.redirect(301, result.long_url);
    } catch (err) {
        next(err);
    }
}

export default {
    redirectLink
}