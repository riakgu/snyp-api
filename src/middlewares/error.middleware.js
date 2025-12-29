import { logger } from "../config/logger.js";
import {ResponseError} from "../errors/response.error.js";

export function errorMiddleware(err, req, res, next) {
    if (err instanceof ResponseError) {
        return res.status(err.status).json({
            errors: err.message
        });
    }
    logger.error(err);
    res.status(500).json({
        errors: err.message
    });
}
