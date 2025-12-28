import redirectService from "../services/redirect.service.js";

async function redirectLink(req, res, next) {
    try {
        const result = await redirectService.redirectLink(req);
        res.redirect(301, result);
    } catch (err) {
        next(err);
    }
}

export default {
    redirectLink,
}