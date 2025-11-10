import {validate} from "../utils/validators.js";
import {prismaClient} from "../config/prisma.js";
import {createLinkAuthValidation, createLinkValidation} from "../validations/link.validation.js";
import {ResponseError} from "../errors/response.error.js";
import * as bcrypt from "bcrypt";
import {customAlphabet} from "nanoid";

async function createLink(req) {
    const isAuth = !!req.auth;
    const schema = isAuth ? createLinkAuthValidation : createLinkValidation;
    const data = validate(schema, req.body);
    const customCode = data.short_code ?? null;
    const passwordHash = data.password ? await bcrypt.hash(data.password, 10) : null;
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const MAX_RETRIES = 100;

    for (const attempt of Array(MAX_RETRIES).keys()) {
        const shortCode = customCode ?? customAlphabet(alphabet, 5)();

        try {
            return await prismaClient.link.create({
                data: {
                    user_id: isAuth ? req.auth.userId : null,
                    title: isAuth ? data.title : null,
                    long_url: data.long_url,
                    short_code: shortCode,
                    password: isAuth ? passwordHash : null,
                    expired_at: isAuth ? data.expired_at : null,
                },
                select: {
                    id: true,
                    user_id: true,
                    title: true,
                    long_url: true,
                    short_code: true,
                    expired_at: true,
                }
            });
        } catch (err) {
            if (err.code === 'P2002') {
                if (customCode) {
                    throw new ResponseError(400, 'Short code already taken');
                }

                if (attempt === MAX_RETRIES - 1) {
                    throw new ResponseError(500, 'Failed to create short code');
                }
                continue;
            }
            throw err;
        }
    }
}

export default {
    createLink,
}