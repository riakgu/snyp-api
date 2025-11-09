import authService from "../services/auth.service.js";
import {logger} from "../utils/logging.js";

async function register(req, res, next) {
    try {
        const result = await authService.register(req.body);
        res.status(200).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const result = await authService.login(req.body);
        res.status(200).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
}

async function refresh(req, res, next) {
    try {
        const result = await authService.refresh(req.body);
        res.status(200).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
}

export default {
    register,
    login,
    refresh,
};