import QRCode from "qrcode";
import {redis} from "../config/redis.js";
import {prismaClient} from "../config/prisma.js";
import {ResponseError} from "../errors/response.error.js";

async function generateQRCode(req) {
    const { shortCode } = req.params;
    const baseUrl = `${req.protocol}://${req.get('host')}`
    const fullUrl = `${baseUrl}/${shortCode}?qr=1`;
    const cacheKey = `qr:${shortCode}`;

    const link = await prismaClient.link.findUnique({
        where: { short_code: shortCode },
    });

    if (!link) {
        throw new ResponseError(404, 'Link not found');
    }

    try {
        const cached = await redis.getBuffer(cacheKey);
        if (cached) {
            return {
                short_code: shortCode,
                buffer: cached
            }
        }

        const qrData = await QRCode.toBuffer(fullUrl, {
            type: 'png',
            errorCorrectionLevel: 'M',
            width: 300,
            margin: 1,
        });

        await redis.setex(cacheKey, 60 * 60 * 24 * 7, qrData);

        return {
            short_code: shortCode,
            buffer: qrData
        }
    } catch (err) {
        throw new ResponseError(500,'Internal Server Error');
    }
}

async function invalidateQRCache(shortCode) {
    await redis.del(`qr:${shortCode}`);
}

export default {
    generateQRCode,
    invalidateQRCache,
}