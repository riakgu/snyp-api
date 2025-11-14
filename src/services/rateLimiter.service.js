import redisService from "./redis.service.js";
import {getClientIp} from "../utils/requestInfo.js";

async function fixedWindow(key, limit, windowSeconds) {
    const currentCount = await redisService.incr(key);

    if (currentCount === 1) {
        await redisService.expire(key, windowSeconds);
    }

    const ttl = await redisService.getTTL(key);

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