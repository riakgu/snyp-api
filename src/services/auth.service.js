import {loginValidation, refreshValidation, registerValidation} from "../validations/auth.validation.js";
import {prisma} from "../config/prisma.js";
import {ResponseError} from "../errors/response.error.js";
import * as bcrypt from "bcrypt";
import {validate} from "../utils/validators.js";
import tokenService from "./token.service.js";

async function register(req) {
    const { name, email, password } = validate(registerValidation, req.body);

    const passwordHashed = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHashed,
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        const tokens = await tokenService.generateTokenPair(user.id);

        return {
            user,
            ...tokens,
        };
    } catch (err) {
        if (err.code === 'P2002') {
            throw new ResponseError(400, "Email already exists");
        }
        throw err;
    }
}
async function login(req) {
    const { email, password } = validate(loginValidation, req.body);

    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
            password: true,
        },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new ResponseError(401, "Invalid credentials");
    }

    const tokens = await tokenService.generateTokenPair(user.id);

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        ...tokens,
    }
}

async function refresh(req) {
    const { refreshToken } = validate(refreshValidation, req.body);

    return await tokenService.refreshAccessToken(refreshToken);
}

async function logout(req) {
    const { userId, token } = req.auth;

    await tokenService.blacklistToken(token);
    await tokenService.revokeUserTokens(userId);
}

export default {
    register,
    login,
    refresh,
    logout,
};