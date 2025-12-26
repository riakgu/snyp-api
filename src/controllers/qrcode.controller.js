import qrcodeService from "../services/qrcode.service.js";

async function getQRCode(req, res, next) {
    try {
        const result = await qrcodeService.generateQRCode(req);
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=604800');
        res.send(result.buffer);
    } catch (err) {
        next(err);
    }
}

async function downloadQRCode(req, res, next) {
    try {
        const result = await qrcodeService.generateQRCode(req);
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Content-Disposition', `attachment; filename="qr-${result.short_code}.png"`);
        res.setHeader('Content-Type', 'image/png');
        res.send(result.buffer);
    } catch (err) {
        next(err);
    }
}

export default {
    downloadQRCode,
    getQRCode
}

