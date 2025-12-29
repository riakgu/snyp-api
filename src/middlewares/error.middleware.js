import { logger } from "../config/logger.js";
import { ResponseError } from "../errors/response.error.js";
import config from "../config/index.js";

export function errorMiddleware(err, req, res, next) {
    if (err instanceof ResponseError) {
        return res.status(err.status).json({
            errors: err.message
        });
    }

    logger.error(err);

    const message = config.app.env === 'production'
        ? 'Internal Server Error'
        : err.message;

    res.status(500).json({
        errors: message
    });
}