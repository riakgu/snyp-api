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

async function getLinkByShortCode(req, res, next) {
    try {
        const result = await linkService.getLinkByShortCode(req);
        res.status(200).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
}

async function updateLink(req, res, next) {
    try {
        const result = await linkService.updateLink(req);
        res.status(200).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
}

async function deleteLink(req, res, next) {
    try {
        await linkService.deleteLink(req);
        res.status(200).json({
            message: "Link has been deleted successfully"
        });
    } catch (err) {
        next(err);
    }
}

export default {
    createLink,
    getLinkByShortCode,
    updateLink,
    deleteLink,
}