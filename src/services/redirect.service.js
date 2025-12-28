import linkService from "./link.service.js";
import statsService from "./stats.service.js";
import { ResponseError } from "../errors/response.error.js";

async function redirectLink(req) {

    const link = await linkService.getLinkByShortCode(req);

    await linkService.validateLinkAccess(link);

    if (link.has_password) {
        throw new ResponseError(403, 'Password is required');
    }

    await statsService.trackVisit(req);

    return link.long_url
}

export default {
    redirectLink,
}