import authService from "../services/auth.service.js";
import {logger} from "../utils/logging.js";

async function register(req, res, next) {
    try {
        const result = await authService.register(req);
        res.status(201).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const result = await authService.login(req);
        res.status(200).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
}

async function refresh(req, res, next) {
    try {
        const result = await authService.refresh(req);
        res.status(200).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
}

async function logout(req, res, next) {
    try {
        await authService.logout(req);
        res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (err) {
        next(err);
    }
}

export default {
    register,
    login,
    refresh,
    logout,
};