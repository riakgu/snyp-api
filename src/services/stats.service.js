import {redis} from "../config/redis.js";
import {prismaClient} from "../config/prisma.js";
import {ResponseError} from "../errors/response.error.js";
import crypto from 'crypto';
import {logger} from "../utils/logging.js";

function generateVisitorId(ipAddress, userAgent) {
    return crypto
        .createHash('sha256')
        .update(`${ipAddress}:${userAgent}`)
        .digest('hex')
        .substring(0, 32);
}

async function trackVisit(req){
    const {shortCode} = req.params;
    const isFromQR = req.query.qr === '1';

    const ipAddress = req.headers['x-forwarded-for']?.split(',').shift() || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    try {
        const visitorId = generateVisitorId(ipAddress, userAgent);
        const uniqueKey = `visitor:${shortCode}:${visitorId}`;

        const isUnique = !(await redis.exists(uniqueKey));
        if (isUnique) {
            await redis.setex(uniqueKey, 86400, '1');
        }

        await prismaClient.link.update({
            where: { short_code: shortCode },
            data: {
                stats: {
                    update: {
                        total_visits:  { increment: 1 },
                        ...(isUnique ? { unique_visits: { increment: 1 } } : {}),
                        ...(isFromQR ? { qr_visits:    { increment: 1 } } : {}),
                    },
                },
            },
        });

    } catch (err) {
        logger.error(err);
    }
}


async function getStats(req) {
    const { shortCode } = req.params;

    const linkStats = await prismaClient.link.findUnique({
        where: { short_code: shortCode },
        select: {
            stats: {
                select: {
                    total_visits: true,
                    unique_visits: true,
                    qr_visits: true,
                },
            },
        },
    });

    if (!linkStats) {
        throw new ResponseError(404, 'Link not found');
    }

    return linkStats.stats;
}

export default {
    getStats,
    trackVisit
}