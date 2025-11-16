import {getClientIp} from "../utils/requestInfo.js";
import {redis} from "../config/redis.js";

async function fixedWindow(key, limit, windowSeconds) {
    const currentCount = await redis.incr(key);

    if (currentCount === 1) {
        await redis.expire(key, windowSeconds);
    }

    const ttl = await redis.ttl(key);

    return {
        allowed: currentCount <= limit,
        current: currentCount,
        limit,
        remaining: Math.max(0, limit - currentCount),
        resetIn: ttl > 0 ? ttl : windowSeconds,
    };
}

function getRateLimitKey(identifier, endpoint) {
    return `rate_limit:${endpoint}:${identifier}`;
}

function getClientIdentifier(req) {
    return getClientIp(req);
}

export default {
    fixedWindow,
    getRateLimitKey,
    getClientIdentifier,
};