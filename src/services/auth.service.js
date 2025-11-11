import {
    getValidation,
    loginValidation,
    logoutValidation,
    refreshValidation,
    registerValidation
} from "../validations/auth.validation.js";
import {prismaClient} from "../config/prisma.js";
import {ResponseError} from "../errors/response.error.js";
import * as bcrypt from "bcrypt";
import {validate} from "../utils/validators.js";
import tokenService from "./token.service.js";
import {logger} from "../utils/logging.js";

async function register(req) {
    const { name, email, password } = validate(registerValidation, req.body);

    const user = await prismaClient.user.findUnique({
        where: {
            email: email,
        }
    })

    if (user) {
        throw new ResponseError(400, "Email already exists");
    }

    const hashed = await bcrypt.hash(password, 10);

    return prismaClient.user.create({
        data: {
            name,
            email,
            password: hashed,
        },
        select: {
            id: true,
            email: true,
            name: true,
        }
    })
}

async function login(req) {
    const { email, password } = validate(loginValidation, req.body);

    const user = await prismaClient.user.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
            password: true,
        }
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new ResponseError(401, "Invalid credentials");
    }

    const accessToken = tokenService.generateAccessToken(user.id);
    const refreshToken = tokenService.generateRefreshToken(user.id);

    await tokenService.storeRefreshToken(user.id, refreshToken);

    return {
        accessToken,
        refreshToken,
    }
}

async function refresh(req) {
    const { refreshToken } = validate(refreshValidation, req.body);

    const decoded = await tokenService.verifyRefreshToken(refreshToken);

    const newAccessToken = tokenService.generateAccessToken(decoded.userId);
    const newRefreshToken = tokenService.generateRefreshToken(decoded.userId);

    await tokenService.storeRefreshToken(decoded.userId, newRefreshToken);

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    }
}

async function logout(req) {
    const { userId, token } = req.auth;

    await tokenService.blacklistToken(token);
    await tokenService.revokeUserTokens(userId);
}

async function get(req) {
    const { userId } = req.auth;

    return prismaClient.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            email: true,
            name: true,
        }
    })
}

export default {
    register,
    login,
    refresh,
    logout,
    get
};