import { redis } from '../config/cache.js';
import {logger} from "../utils/logging.js";

async function get(key) {
    try {
        return await redis.get(key);
    } catch (err) {
        logger.error(`Redis GET error for key: ${key}`, err);
        return null;
    }
}

async function getBuffer(key) {
    try {
        return await redis.getBuffer(key);
    } catch (err) {
        logger.error(`Redis GETBUFFER error for key: ${key}`, err);
        return null;
    }
}

async function set(key, value, expirySeconds = null) {
    try {
        if (expirySeconds) {
            return await redis.setex(key, expirySeconds, value);
        }
        return await redis.set(key, value);
    } catch (err) {
        logger.error(`Redis SET error for key: ${key}`, err);
        return null;
    }
}

async function setex(key, expirySeconds, value) {
    return set(key, value, expirySeconds);
}

async function del(...keys) {
    try {
        return await redis.del(...keys);
    } catch (err) {
        logger.error(`Redis DEL error for keys: ${keys}`, err);
        return 0;
    }
}

async function exists(key) {
    try {
        return await redis.exists(key);
    } catch (err) {
        logger.error(`Redis EXISTS error for key: ${key}`, err);
        return 0;
    }
}

async function hincrby(key, field, increment = 1) {
    try {
        return await redis.hincrby(key, field, increment);
    } catch (err) {
        logger.error(`Redis HINCRBY error for key: ${key}`, err);
        return null;
    }
}

async function hgetall(key) {
    try {
        return await redis.hgetall(key);
    } catch (err) {
        logger.error(`Redis HGETALL error for key: ${key}`, err);
        return {};
    }
}

async function sadd(key, ...members) {
    try {
        return await redis.sadd(key, ...members);
    } catch (err) {
        logger.error(`Redis SADD error for key: ${key}`, err);
        return 0;
    }
}

async function smembers(key) {
    try {
        return await redis.smembers(key);
    } catch (err) {
        logger.error(`Redis SMEMBERS error for key: ${key}`, err);
        return [];
    }
}

async function srem(key, ...members) {
    try {
        return await redis.srem(key, ...members);
    } catch (err) {
        logger.error(`Redis SREM error for key: ${key}`, err);
        return 0;
    }
}

async function expire(key, seconds) {
    try {
        return await redis.expire(key, seconds);
    } catch (err) {
        logger.error(`Redis EXPIRE error for key: ${key}`, err);
        return 0;
    }
}

function pipeline() {
    return redis.pipeline();
}

async function getTTL(key) {
    try {
        return await redis.ttl(key);
    } catch (error) {
        console.error(`Redis TTL error for key: ${key}`, error);
        return -1;
    }
}

async function incr(key) {
    try {
        return await redis.incr(key);
    } catch (error) {
        console.error(`Redis INCR error for key: ${key}`, error);
        return null;
    }
}

export default {
    get,
    getBuffer,
    set,
    setex,
    del,
    exists,
    hincrby,
    hgetall,
    sadd,
    smembers,
    srem,
    expire,
    pipeline,
    getTTL,
    incr
};