import jwt from "jsonwebtoken";
import {redis} from "../config/redis.js";
import {ResponseError} from "../errors/response.error.js";
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

async function verifyRefreshToken(token) {
    try {
        const decoded = jwt.verify(token, env('JWT_REFRESH_SECRET'));
        const key = `refresh_token:${decoded.userId}`;
        const stored = await redis.get(key);

        if (stored !== token) {
            throw new ResponseError(401,'Invalid refresh token');
        }

        return decoded;
    } catch (error) {
        throw new ResponseError(401,'Invalid refresh token');
    }
}

async function blacklistToken(token) {
    const decoded = jwt.decode(token);
    const exp = decoded.exp - Math.floor(Date.now() / 1000);

    if (exp > 0) {
        await redis.setex(`blacklist:${token}`, exp, 'true');
    }
}

async function isTokenBlacklisted(token) {
    const result = await redis.get(`blacklist:${token}`);
    return result !== null;
}

async function revokeUserTokens(userId) {
    await redis.del(`refresh_token:${userId}`);
}

export default {
    generateAccessToken,
    generateRefreshToken,
    storeRefreshToken,
    verifyRefreshToken,
    blacklistToken,
    isTokenBlacklisted,
    revokeUserTokens,
}