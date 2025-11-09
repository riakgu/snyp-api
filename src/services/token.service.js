import jwt from "jsonwebtoken";
import {redis} from "../config/redis.js";
import {env} from "../config/env.js";

function generateAccessToken(userId) {
    return jwt.sign(
        { userId, type: 'access' },
        env('JWT_ACCESS_SECRET'),
        { expiresIn: '15m' }
    );
}

function generateRefreshToken(userId) {
    return jwt.sign(
        { userId, type: 'refresh' },
        env('JWT_REFRESH_SECRET'),
        { expiresIn: '7d' }
    );
}

async function storeRefreshToken(userId, token) {
    const key = `refresh_token:${userId}`;
    await redis.setex(key, 7 * 24 * 60 * 60, token); // 7 days
}


export default {
    generateAccessToken,
    generateRefreshToken,
    storeRefreshToken,
}