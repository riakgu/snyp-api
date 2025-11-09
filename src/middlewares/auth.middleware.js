import tokenService from "../services/token.service.js";
import jwt from "jsonwebtoken";
import {env} from "../config/env.js";
import {logger} from "../utils/logging.js";
import {ResponseError} from "../errors/response.error.js";


export async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ResponseError(401,'No token provided');
        }

        const token = authHeader.substring(7);

        const isBlacklisted = await tokenService.isTokenBlacklisted(token);
        if (isBlacklisted) {
            throw new ResponseError(401,'Token has been revoked');
        }

        const decoded = jwt.verify(token, env('JWT_ACCESS_SECRET'));

        if (decoded.type !== 'access') {
            throw new ResponseError(401,'Invalid token type');
        }

        req.auth = {
            userId: decoded.userId,
            token: token,
        }

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new ResponseError(401,'Token expired');
        }
        throw new ResponseError(401,'Invalid token');
    }
}