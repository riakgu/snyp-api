import redirectService from "../services/redirect.service.js";

async function redirectLink(req, res, next) {
    try {
        const result = await redirectService.redirectLink(req);
        res.redirect(301, result);
    } catch (err) {
        next(err);
    }
}

async function verifyPasswordLink(req, res, next) {
    try {
        const result = await redirectService.verifyPasswordLink(req);
        result.password = undefined;
        result.archived_at = undefined;
        res.status(200).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
}

export default {
    redirectLink,
    verifyPasswordLink,
}