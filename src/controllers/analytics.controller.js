import analyticsService from "../services/analytics.service.js";

async function getOverview(req, res, next) {
    try {
        const result = await analyticsService.getOverview(req);
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
}

async function getClicks(req, res, next) {
    try {
        const result = await analyticsService.getClicks(req);
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
}

async function getTopLinks(req, res, next) {
    try {
        const result = await analyticsService.getTopLinks(req);
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
}

async function getReferrers(req, res, next) {
    try {
        const result = await analyticsService.getReferrers(req);
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
}

async function getDevices(req, res, next) {
    try {
        const result = await analyticsService.getDevices(req);
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
}

async function getBrowsers(req, res, next) {
    try {
        const result = await analyticsService.getBrowsers(req);
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
}

async function getCountries(req, res, next) {
    try {
        const result = await analyticsService.getCountries(req);
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
}

async function getCities(req, res, next) {
    try {
        const result = await analyticsService.getCities(req);
        res.status(200).json({ data: result });
    } catch (err) {
        next(err);
    }
}

async function exportClicks(req, res, next) {
    try {
        const { csv, filename } = await analyticsService.exportClicks(req);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    } catch (err) {
        next(err);
    }
}

async function exportTopLinks(req, res, next) {
    try {
        const { csv, filename } = await analyticsService.exportTopLinks(req);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    } catch (err) {
        next(err);
    }
}

async function exportReferrers(req, res, next) {
    try {
        const { csv, filename } = await analyticsService.exportReferrers(req);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    } catch (err) {
        next(err);
    }
}

async function exportDevices(req, res, next) {
    try {
        const { csv, filename } = await analyticsService.exportDevices(req);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    } catch (err) {
        next(err);
    }
}

async function exportBrowsers(req, res, next) {
    try {
        const { csv, filename } = await analyticsService.exportBrowsers(req);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    } catch (err) {
        next(err);
    }
}

async function exportCountries(req, res, next) {
    try {
        const { csv, filename } = await analyticsService.exportCountries(req);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    } catch (err) {
        next(err);
    }
}


export default {
    getOverview,
    getClicks,
    getTopLinks,
    getReferrers,
    getDevices,
    getBrowsers,
    getCountries,
    getCities,
    exportClicks,
    exportTopLinks,
    exportReferrers,
    exportDevices,
    exportBrowsers,
    exportCountries,
};