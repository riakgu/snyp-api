import {validate} from "../utils/validators.js";
import {prismaClient} from "../config/prisma.js";
import {createLinkAuthValidation, createLinkValidation, updateLinkValidation} from "../validations/link.validation.js";
import {ResponseError} from "../errors/response.error.js";
import * as bcrypt from "bcrypt";
import {customAlphabet} from "nanoid";
import * as logger from "winston";

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
            const link = await prismaClient.link.create({
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
                    password: true,
                    expired_at: true,
                }
            });
            return {
                ...link,
                has_password: !!link.password,
                password: undefined,
            }
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

async function getLinkByShortCode(req) {
    const { shortCode } = req.params;
    const { password } = req.query;

    const link = await prismaClient.link.findUnique({
        where: { short_code: shortCode },
        select: {
            id: true,
            user_id: true,
            title: true,
            long_url: true,
            short_code: true,
            password: true,
            expired_at: true,
        }
    });

    if (!link) {
        throw new ResponseError(404, 'Link tidak ditemukan');
    }

    if (link.expired_at && new Date(link.expired_at) < new Date()) {
        throw new ResponseError(410, 'Link sudah expired');
    }

    if (link.password) {
        if (!password) {
            throw new ResponseError(401, 'Password diperlukan');
        }
        const isValid = await bcrypt.compare(password, link.password);
        if (!isValid) {
            throw new ResponseError(401, 'Password salah');
        }
    }

    return {
        ...link,
        has_password: !!link.password,
        password: undefined,
    };
}

async function updateLink(req) {
    const { userId } = req.auth;
    const { shortCode } = req.params;
    const data = validate(updateLinkValidation, req.body);

    const customCode = data.short_code ?? req.params.shortCode;
    const passwordHash = data.password ? await bcrypt.hash(data.password, 10) : undefined;

    try {
        const link = await prismaClient.link.update({
            where: {
                short_code: shortCode,
                user_id: userId,
            },
            data: {
                title: data.title ?? undefined,
                long_url: data.long_url ?? undefined,
                short_code: customCode,
                password: passwordHash,
                expired_at: data.expired_at ?? undefined,
            },
            select: {
                id: true,
                user_id: true,
                title: true,
                long_url: true,
                short_code: true,
                password: true,
                expired_at: true,
            }
        });
        return {
            ...link,
            has_password: !!link.password,
            password: undefined,
        }
    } catch (err) {
        if (err.code === 'P2002') {
            if (shortCode) {
                throw new ResponseError(400, 'Short code already taken');
            }
        }
        if (err.code === 'P2025') {
            throw new ResponseError(404, 'Link not found');
        }
        logger.error(err);
        throw ResponseError(500, 'Internal Server Error');
    }
}

async function deleteLink(req) {
    const { userId } = req.auth;
    const { shortCode } = req.params;

    try {
        return await prismaClient.link.delete({
            where: {
                short_code: shortCode,
                user_id: userId,
            },
        })
    } catch (err) {
        if (err.code === 'P2025') {
            throw new ResponseError(404, 'Link not found');
        }
        logger.error(err);
        throw ResponseError(500, 'Internal Server Error');
    }
}

export default {
    createLink,
    getLinkByShortCode,
    updateLink,
    deleteLink,
}