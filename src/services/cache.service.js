import { redis } from '../config/redis.js';

// LINK CACHING

const URL_CACHE_TTL = 3600; // 1 hour

async function cacheLink(shortCode, linkData) {
    const key = `link:${shortCode}`;
    return redis.setex(key, URL_CACHE_TTL, JSON.stringify(linkData));
}

async function getCachedLink(shortCode) {
    const key = `link:${shortCode}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
}

async function invalidateLinkCache(shortCode) {
    const key = `link:${shortCode}`;
    return redis.del(key);
}

async function cacheLongUrl(shortCode, longUrl) {
    const key = `url:${shortCode}`;
    return redis.setex(key, URL_CACHE_TTL, longUrl);
}

async function getCachedLongUrl(shortCode) {
    const key = `url:${shortCode}`;
    return redis.get(key);
}

// VISITOR TRACKING

const VISITOR_TTL = 86400; // 24 hours

async function markVisitorSeen(shortCode, visitorId) {
    const key = `visitor:${shortCode}:${visitorId}`;
    return redis.setex(key, VISITOR_TTL, '1');
}

async function isVisitorSeen(shortCode, visitorId) {
    const key = `visitor:${shortCode}:${visitorId}`;
    return redis.exists(key);
}

// QR CODE CACHING

const QR_CACHE_TTL = 604800; // 7 days

async function cacheQRCode(shortCode, qrBuffer) {
    const key = `qr:${shortCode}`;
    return redis.setex(key, QR_CACHE_TTL, qrBuffer);
}

async function getCachedQRCode(shortCode) {
    const key = `qr:${shortCode}`;
    return redis.getBuffer(key);
}

async function invalidateQRCache(shortCode) {
    const key = `qr:${shortCode}`;
    return redis.del(key);
}

// TOKEN MANAGEMENT

const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days

async function storeRefreshToken(userId, token) {
    const key = `refresh_token:${userId}`;
    return redis.setex(key, REFRESH_TOKEN_TTL, token);
}

async function getRefreshToken(userId) {
    const key = `refresh_token:${userId}`;
    return redis.get(key);
}

async function deleteRefreshToken(userId) {
    const key = `refresh_token:${userId}`;
    return redis.del(key);
}

async function blacklistToken(token, expirySeconds) {
    const key = `blacklist:${token}`;
    return redis.setex(key, expirySeconds, 'true');
}

async function isTokenBlacklisted(token) {
    const key = `blacklist:${token}`;
    const result = await redis.get(key);
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