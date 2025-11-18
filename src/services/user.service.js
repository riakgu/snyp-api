import {validate} from "../utils/validators.js";
import {updateUserValidation} from "../validations/user.validation.js";
import {prismaClient} from "../config/database.js";
import {ResponseError} from "../errors/response.error.js";

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

export default {
    updateUser
}