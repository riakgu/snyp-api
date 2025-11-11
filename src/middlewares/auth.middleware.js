import tokenService from "../services/token.service.js";
import jwt from "jsonwebtoken";
import {env} from "../config/env.js";
import {logger} from "../utils/logging.js";
import {ResponseError} from "../errors/response.error.js";

export async function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ResponseError(401,'No token provided');
        }

        const token = authHeader.substring(7);

        if (!token) {
            throw new ResponseError(401, 'Invalid token')
        }

        const isBlacklisted = await tokenService.isTokenBlacklisted(token);
        if (isBlacklisted) {
            throw new ResponseError(401,'Token has been revoked');
        }

        const decoded = jwt.verify(token, env('JWT_ACCESS_SECRET'));

        req.auth = {
            userId: decoded.userId,
            token: token,
        };

        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            throw new ResponseError(401, 'Invalid token')
        }

        if (err.name === 'TokenExpiredError') {
            throw new ResponseError(401, 'Token has been expired')
        }

        throw new ResponseError(401, err.message)
    }
}

export async function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            req.auth = null;
            return next();
        }

        const token = authHeader.substring(7);

        if (!token) {
            req.auth = null;
            return next();
        }

        const isBlacklisted = await tokenService.isTokenBlacklisted(token);
        if (isBlacklisted) {
            req.auth = null;
            return next();
        }

        const decoded = jwt.verify(token, env('JWT_ACCESS_SECRET'));

        req.auth = {
            userId: decoded.userId,
            token: token,
        };

        next();
    } catch (err) {
        req.auth = null;
        next();
    }
}