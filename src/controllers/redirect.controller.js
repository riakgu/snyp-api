import redirectService from "../services/redirect.service.js";

async function redirectLink(req, res, next) {
    try {
        const result = await redirectService.redirectLink(req);

        const statusCode = result.type === 'redirect' ? 301 : 302;

        res.redirect(statusCode, result.url);
    } catch (err) {
        next(err);
    }
}

export default {
    redirectLink,
}