import linkService from "./link.service.js";
import statsService from "./stats.service.js";
import config from "../config/index.js";

async function redirectLink(req) {

    const { shortCode } = req.params;

    let link;

    try {
        link = await linkService.getLinkByShortCode(req);
    } catch (err) {
        if (err.status === 404) {
            return {
                type: 'not_found',
                url: `${config.app.frontendUrl}/n/${shortCode}`
            };
        }
        throw err;
    }

    if (link.expired_at && new Date(link.expired_at) < new Date()) {
        return {
            type: 'expired',
            url: `${config.app.frontendUrl}/e/${link.short_code}`
        };
    }

    if (link.is_archived) {
        return {
            type: 'archived',
            url: `${config.app.frontendUrl}/n/${link.short_code}`
        };
    }

    if (link.has_password) {
        return {
            type: 'password',
            url: `${config.app.frontendUrl}/p/${link.short_code}`
        };
    }

    await statsService.trackVisit(req);

    return {
        type: 'redirect',
        url: link.long_url
    };
}

export default {
    redirectLink,
}