import {loginValidation, registerValidation} from "../validations/auth.validation.js";
import {prismaClient} from "../config/prisma.js";
import {ResponseError} from "../errors/response.error.js";
import * as bcrypt from "bcrypt";
import {validate} from "../utils/validators.js";
import tokenService from "./token.service.js";

async function register(req) {
    const { name, email, password } = validate(registerValidation, req);

    const user = await prismaClient.user.findUnique({
        where: {
            email: email,
        }
    })

    if (user) {
        throw new ResponseError(400, "email already exists");
    }

    const hashed = await bcrypt.hash(password, 10);

    return prismaClient.user.create({
        data: {
            name,
            email,
            password: hashed,
        },
        select: {
            email: true,
            name: true,
        }
    })
}

async function login(req) {
    const { email, password } = validate(loginValidation, req);

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
        throw new ResponseError(401, "email or password wrong");
    }

    const accessToken = tokenService.generateAccessToken(user.id);
    const refreshToken = tokenService.generateRefreshToken(user.id);

    await tokenService.storeRefreshToken(user.id, refreshToken);

    return {
        accessToken,
        refreshToken,
    }
}

export default {
    register,
    login,
};