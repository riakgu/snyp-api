import {validate} from "../validations/validation.js";
import {registerValidation} from "../validations/auth.validation.js";
import {prismaClient} from "../config/prisma.js";
import {ResponseError} from "../errors/response.error.js";
import * as bcrypt from "bcrypt";

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

export default { register };