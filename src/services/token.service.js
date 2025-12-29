import jwt from "jsonwebtoken";
import { ResponseError } from "../errors/response.error.js";
import config from "../config/index.js";
import cacheService from "./cache.service.js";
import {logger} from "../config/logger.js";

function generateAccessToken(userId) {
    return jwt.sign(
        { userId, type: 'access' },
        config.jwt.accessSecret,
        { expiresIn: config.jwt.accessExpire }
    );
}

function generateRefreshToken(userId) {
    return jwt.sign(
        { userId, type: 'refresh' },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpire }
    );
}

async function storeRefreshToken(userId, token) {
    return cacheService.storeRefreshToken(userId, token);
}

async function verifyRefreshToken(token) {
    try {
        const decoded = jwt.verify(token, config.jwt.refreshSecret);

        if (decoded.type !== 'refresh') {
            throw new ResponseError(401, 'Invalid token type');
        }

        const stored = await cacheService.getRefreshToken(decoded.userId);

        if (stored !== token) {
            throw new ResponseError(401, 'Invalid refresh token');
        }

        return decoded;
    } catch (error) {
        if (error instanceof ResponseError) {
            throw error;
        }
        throw new ResponseError(401, 'Invalid or expired refresh token');
    }
}

function verifyAccessToken(token) {
    try {
        const decoded = jwt.verify(token, config.jwt.accessSecret);

        if (decoded.type !== 'access') {
            throw new ResponseError(401, 'Invalid token type');
        }

        return decoded;
    } catch (error) {
        if (error instanceof ResponseError) {
            throw error;
        }
        throw new ResponseError(401, 'Invalid or expired access token');
    }
}

async function blacklistToken(token) {
    try {
        const decoded = jwt.decode(token);

        if (!decoded || !decoded.exp) {
            return;
        }

        const exp = decoded.exp - Math.floor(Date.now() / 1000);

        if (exp > 0) {
            await cacheService.blacklistToken(token, exp);
        }
    } catch (error) {
        logger.error('Error blacklisting token:', error);
    }
}

async function isTokenBlacklisted(token) {
    return cacheService.isTokenBlacklisted(token);
}

async function revokeUserTokens(userId) {
    return cacheService.deleteRefreshToken(userId);
}

async function generateTokenPair(userId) {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    await storeRefreshToken(userId, refreshToken);

    return {
        accessToken,
        refreshToken,
    };
}

async function refreshAccessToken(refreshToken) {
    const decoded = await verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(decoded.userId);

    return {
        accessToken: newAccessToken,
    };
}

export default {
    generateAccessToken,
    generateRefreshToken,
    generateTokenPair,
    storeRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    refreshAccessToken,
    blacklistToken,
    isTokenBlacklisted,
    revokeUserTokens,
};