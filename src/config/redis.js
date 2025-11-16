import Redis from "ioredis";
import config from "./index.js";
import {logger} from "../utils/logging.js";

export const redis = new Redis(config.redis.url);

redis.on('connect', () => {
    logger.info('Redis connected');
});

redis.on('error', (err) => {
    logger.error('Redis error:', err);
});

redis.on('close', () => {
    logger.info('Redis connection closed');
});