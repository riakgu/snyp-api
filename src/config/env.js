import {logger} from "../utils/logging.js";

export function env(key, defaultValue) {
    const value = process.env[key];
    if (value === undefined) {
        if (defaultValue !== undefined) return defaultValue;
        logger.error(`Missing required environment variable: ${key}`);
    }
    return value;
}
