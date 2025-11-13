import {prismaClient} from "../config/database.js";
import {ResponseError} from "../errors/response.error.js";
import crypto from 'crypto';
import {logger} from "../utils/logging.js";
import cacheService from "./cache.service.js";

function generateVisitorId(ipAddress, userAgent) {
    return crypto
        .createHash('sha256')
        .update(`${ipAddress}:${userAgent}`)
        .digest('hex')
        .substring(0, 32);
}

async function trackVisit(req){
    const { shortCode } = req.params;
    const isFromQR = req.query.qr === '1';

    const ipAddress = req.headers['x-forwarded-for']?.split(',').shift()?.trim() || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    try {
        const visitorId = generateVisitorId(ipAddress, userAgent);
        const isUnique = !(await cacheService.isVisitorSeen(shortCode, visitorId));

        if (isUnique) {
            await cacheService.markVisitorSeen(shortCode, visitorId);
        }

        const updates = {
            totalVisits: 1,
            uniqueVisits: isUnique ? 1 : 0,
            qrVisits: isFromQR ? 1 : 0,
        };

        await cacheService.incrementStats(shortCode, updates);
        await cacheService.addToPendingFlush(shortCode);

    } catch (err) {
        logger.error(err);
    }
}


async function getStats(req) {
    const { shortCode } = req.params;

    const link = await prismaClient.link.findUnique({
        where: { short_code: shortCode },
        include: { stats: true },
    });

    if (!link) {
        throw new ResponseError(404, 'Link not found');
    }

    const redisStats = await cacheService.getPendingStats(shortCode);

    return {
        total_visits: (link.stats?.total_visits || 0) +
            parseInt(redisStats.total_visits || 0),
        unique_visits: (link.stats?.unique_visits || 0) +
            parseInt(redisStats.unique_visits || 0),
        qr_visits: (link.stats?.qr_visits || 0) +
            parseInt(redisStats.qr_visits || 0),
    };
}

async function flushStatsToDatabase() {
    try {
        const pendingShortCodes = await cacheService.getPendingFlushList();

        if (pendingShortCodes.length === 0) {
            return { flushed: 0 };
        }

        logger.info(`Flushing stats for ${pendingShortCodes.length} links...`);

        let flushed = 0;
        const batchSize = 100;

        for (let i = 0; i < pendingShortCodes.length; i += batchSize) {
            const batch = pendingShortCodes.slice(i, i + batchSize);

            await Promise.allSettled(
                batch.map(async (shortCode) => {
                    try {
                        const redisStats = await cacheService.getPendingStats(shortCode);

                        if (!redisStats || Object.keys(redisStats).length === 0) {
                            await cacheService.removeFromPendingFlush(shortCode);
                            return;
                        }

                        const totalVisits = parseInt(redisStats.total_visits || 0);
                        const uniqueVisits = parseInt(redisStats.unique_visits || 0);
                        const qrVisits = parseInt(redisStats.qr_visits || 0);

                        await prismaClient.link.update({
                            where: { short_code: shortCode },
                            data: {
                                stats: {
                                    update: {
                                        total_visits: { increment: totalVisits },
                                        unique_visits: { increment: uniqueVisits },
                                        qr_visits: { increment: qrVisits },
                                    },
                                },
                            },
                        });

                        await cacheService.clearPendingStats(shortCode);
                        await cacheService.removeFromPendingFlush(shortCode);

                        flushed++;
                    } catch (error) {
                        if (error.code === 'P2025') {
                            logger.warn(`Link not found: ${shortCode}`);
                            await cacheService.removeFromPendingFlush(shortCode);
                            return;
                        }
                        logger.error(`Error flushing stats for ${shortCode}:`, error);
                    }
                })
            );
        }
        logger.info(`Flushed ${flushed} link stats to database`);
    } catch (error) {
        logger.error('Error flushing stats:', error);
        throw error;
    }
}

export default {
    getStats,
    trackVisit,
    flushStatsToDatabase,
}