import Redis from "ioredis";
import { env } from "./env.js";
import {logger} from "../utils/logging.js";

export const redis = new Redis(env("REDIS_URL"));

redis.on('connect', () => {
    logger.info('Redis connected');
});

redis.on('error', (err) => {
    logger.error('Redis error:', err);
});

redis.on('close', () => {
    logger.info('Redis connection closed');
});