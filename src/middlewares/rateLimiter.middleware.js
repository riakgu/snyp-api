import rateLimiterService from "../services/rateLimiter.service.js";
import { logger } from "../utils/logging.js";

export function createRateLimiter(options = {}) {
    const {
        limit = 100,
        windowSeconds = 60,
        keyPrefix = 'global',
    } = options;

    return async (req, res, next) => {
        try {
            const identifier = rateLimiterService.getClientIdentifier(req);
            const key = rateLimiterService.getRateLimitKey(identifier, keyPrefix);

            const result = await rateLimiterService.fixedWindow(
                key,
                limit,
                windowSeconds
            );

            res.setHeader('X-RateLimit-Limit', result.limit);
            res.setHeader('X-RateLimit-Remaining', result.remaining);
            res.setHeader('X-RateLimit-Reset', result.resetIn);

            if (!result.allowed) {
                res.setHeader('Retry-After', result.resetIn);

                return res.status(429).json({
                    errors: 'Too many requests, please try again later',
                });
            }

            next();

        } catch (err) {
            logger.error('Rate limiter error:', err);
            next();
        }
    };
}
