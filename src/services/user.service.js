import {validate} from "../utils/validators.js";
import {updatePasswordValidation, updateUserValidation} from "../validations/user.validation.js";
import {prismaClient} from "../config/database.js";
import {ResponseError} from "../errors/response.error.js";
import * as bcrypt from "bcrypt";

async function updateUser(req) {
    const userId = req.auth.userId;
    const { name } = validate(updateUserValidation, req.body);

    try {
        return await prismaClient.user.update({
            where: {id: userId},
            data: {
                name: name,
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        })
    } catch (err) {
        if (err.code === 'P2025') {
            throw new ResponseError(404, 'User not found');
        }
        throw err;
    }
}

async function updatePassword(req) {
    const userId = req.auth.userId;
    const { old_password, new_password } = validate(updatePasswordValidation, req.body);

    const user = await prismaClient.user.findUnique({
        where: {id: userId},
        select: {
            password: true
        }
    });

    if (!user) {
        throw new ResponseError(404, 'User not found');
    }

    const match = await bcrypt.compare(old_password, user.password);

    if (!match) {
        throw new ResponseError(400, 'Old passwords do not match');
    }

    const passwordHashed = await bcrypt.hash(new_password, 10);

    await prismaClient.user.update({
        where: {id: userId},
        data: {
            password: passwordHashed,
        }
    })
}

async function getProfile(req) {
    const userId = req.auth.userId;

    const user = await prismaClient.user.findUnique({
        where: {id: userId},
        select: {
            id: true,
            email: true,
            name: true,
        }
    });

    if (!user) {
        throw new ResponseError(404, 'User not found');
    }

    return user;
}

export default {
    updateUser,
    updatePassword,
    getProfile
}