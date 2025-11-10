import linkService from "../services/link.service.js";

async function createLink(req, res, next) {
    try {
        const result = await linkService.createLink(req);
        res.status(200).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
}

export default {
    createLink,
}