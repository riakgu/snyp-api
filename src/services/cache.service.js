import redisService from "./redis.service.js";

// LINK CACHING

const URL_CACHE_TTL = 3600; // 1 hour

async function cacheLink(shortCode, linkData) {
    const key = `link:${shortCode}`;
    return redisService.setex(key, URL_CACHE_TTL, JSON.stringify(linkData));
}

async function getCachedLink(shortCode) {
    const key = `link:${shortCode}`;
    const data = await redisService.get(key);
    return data ? JSON.parse(data) : null;
}

async function invalidateLinkCache(shortCode) {
    const key = `link:${shortCode}`;
    return redisService.del(key);
}

async function cacheLongUrl(shortCode, longUrl) {
    const key = `url:${shortCode}`;
    return redisService.setex(key, URL_CACHE_TTL, longUrl);
}

async function getCachedLongUrl(shortCode) {
    const key = `url:${shortCode}`;
    return redisService.get(key);
}

// VISITOR TRACKING

const VISITOR_TTL = 86400; // 24 hours

async function markVisitorSeen(shortCode, visitorId) {
    const key = `visitor:${shortCode}:${visitorId}`;
    return redisService.setex(key, VISITOR_TTL, '1');
}

async function isVisitorSeen(shortCode, visitorId) {
    const key = `visitor:${shortCode}:${visitorId}`;
    return redisService.exists(key);
}

// STATS BUFFERING

const STATS_TTL = 2592000; // 30 days

async function incrementStats(shortCode, updates) {
    const key = `stats:${shortCode}`;
    const pipeline = redisService.pipeline();

    if (updates.totalVisits) {
        pipeline.hincrby(key, 'total_visits', updates.totalVisits);
    }
    if (updates.uniqueVisits) {
        pipeline.hincrby(key, 'unique_visits', updates.uniqueVisits);
    }
    if (updates.qrVisits) {
        pipeline.hincrby(key, 'qr_visits', updates.qrVisits);
    }

    pipeline.expire(key, STATS_TTL);
    return pipeline.exec();
}

async function getPendingStats(shortCode) {
    const key = `stats:${shortCode}`;
    return redisService.hgetall(key);
}

async function clearPendingStats(shortCode) {
    const key = `stats:${shortCode}`;
    return redisService.del(key);
}

async function addToPendingFlush(shortCode) {
    return redisService.sadd('stats:pending', shortCode);
}

async function getPendingFlushList() {
    return redisService.smembers('stats:pending');
}

async function removeFromPendingFlush(shortCode) {
    return redisService.srem('stats:pending', shortCode);
}

// QR CODE CACHING

const QR_CACHE_TTL = 604800; // 7 days

async function cacheQRCode(shortCode, qrBuffer) {
    const key = `qr:${shortCode}`;
    return redisService.setex(key, QR_CACHE_TTL, qrBuffer);
}

async function getCachedQRCode(shortCode) {
    const key = `qr:${shortCode}`;
    return redisService.getBuffer(key);
}

async function invalidateQRCache(shortCode) {
    const key = `qr:${shortCode}`;
    return redisService.del(key);
}

// TOKEN MANAGEMENT

const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days

async function storeRefreshToken(userId, token) {
    const key = `refresh_token:${userId}`;
    return redisService.setex(key, REFRESH_TOKEN_TTL, token);
}

async function getRefreshToken(userId) {
    const key = `refresh_token:${userId}`;
    return redisService.get(key);
}

async function deleteRefreshToken(userId) {
    const key = `refresh_token:${userId}`;
    return redisService.del(key);
}

async function blacklistToken(token, expirySeconds) {
    const key = `blacklist:${token}`;
    return redisService.setex(key, expirySeconds, 'true');
}

async function isTokenBlacklisted(token) {
    const key = `blacklist:${token}`;
    const result = await redisService.get(key);
    return result !== null;
}

export default {
    // Link caching
    cacheLink,
    getCachedLink,
    invalidateLinkCache,
    cacheLongUrl,
    getCachedLongUrl,

    // Visitor tracking
    markVisitorSeen,
    isVisitorSeen,

    // Stats buffering
    incrementStats,
    getPendingStats,
    clearPendingStats,
    addToPendingFlush,
    getPendingFlushList,
    removeFromPendingFlush,

    // QR code caching
    cacheQRCode,
    getCachedQRCode,
    invalidateQRCache,

    // Token management
    storeRefreshToken,
    getRefreshToken,
    deleteRefreshToken,
    blacklistToken,
    isTokenBlacklisted,
};