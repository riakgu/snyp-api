import crypto from 'crypto';
import { prismaClient } from '../config/database.js';
import { ResponseError } from '../errors/response.error.js';
import { logger } from "../utils/logging.js";
import queueService from './queue.service.js';
import { getClientIp, getUserAgent } from "../utils/requestInfo.js";
import cacheService from "./cache.service.js";


function generateVisitorId(ipAddress, userAgent) {
    return crypto
        .createHash('sha256')
        .update(`${ipAddress}:${userAgent}`)
        .digest('hex')
        .substring(0, 32);
}

async function trackVisit(req) {
    const { shortCode } = req.params;
    const isFromQR = req.query.qr === '1';

    const ipAddress = getClientIp(req);
    const userAgent = getUserAgent(req);

    try {
        const visitorId = generateVisitorId(ipAddress, userAgent);
        const isUnique = !(await cacheService.isVisitorSeen(shortCode, visitorId));

        if (isUnique) {
            await cacheService.markVisitorSeen(shortCode, visitorId);
        }

        await queueService.publishVisitEvent({
            shortCode,
            isFromQR,
            isUnique,
        });

    } catch (err) {
        logger.error('Failed to track visit:', err);
    }
}

async function getTotalStats(req) {
    const { userId } = req.auth;

    const result = await prismaClient.linkStats.aggregate({
        where: {
            link: {
                user_id: userId,
                deleted_at: null,
            }
        },
        _sum: {
            total_visits: true,
            unique_visits: true,
            qr_visits: true,
        }
    });

    const totalLinks = await prismaClient.link.count({
        where: { user_id: userId, deleted_at: null, archived_at: null }
    });

    const archivedLinks = await prismaClient.link.count({
        where: { user_id: userId, deleted_at: null, archived_at: { not: null } }
    });

    return {
        total_links: totalLinks + archivedLinks,
        active_links: totalLinks,
        archived_links: archivedLinks,
        total_visits: result._sum.total_visits ?? 0,
        unique_visits: result._sum.unique_visits ?? 0,
        qr_visits: result._sum.qr_visits ?? 0,
    };
}

async function getStats(req) {
    const { shortCode } = req.params;

    try {
        const link = await prismaClient.link.findUnique({
            where: { short_code: shortCode },
            include: { stats: true },
        });

        if (!link) {
            throw new ResponseError(404, 'Link not found');
        }

        return {
            total_visits: link.stats.total_visits,
            unique_visits: link.stats.unique_visits,
            qr_visits: link.stats.qr_visits,
        };

    } catch (err) {
        throw err;
    }
}

async function processVisitEvent(data) {
    const { shortCode, isFromQR, isUnique } = data;

    try {
        await prismaClient.link.update({
            where: { short_code: shortCode },
            data: {
                stats: {
                    update: {
                        total_visits: { increment: 1 },
                        ...(isUnique ? { unique_visits: { increment: 1 } } : {}),
                        ...(isFromQR ? { qr_visits: { increment: 1 } } : {}),
                    },
                },
            },
        });

        logger.info(`Processed visit: ${shortCode}`);

    } catch (err) {
        logger.error(`Error processing visit for ${shortCode}:`, err);
        throw err;
    }
}

export default {
    trackVisit,
    getStats,
    getTotalStats,
    processVisitEvent,
};
