import {validate} from "../utils/validators.js";
import {prismaClient} from "../config/prisma.js";
import {createLinkAuthValidation, createLinkValidation, updateLinkValidation} from "../validations/link.validation.js";
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
            const link = await prismaClient.link.create({
                data: {
                    user_id: isAuth ? req.auth.userId : null,
                    title: isAuth ? data.title : null,
                    long_url: data.long_url,
                    short_code: shortCode,
                    password: isAuth ? passwordHash : null,
                    expired_at: isAuth ? data.expired_at : null,
                    stats: { create: {} }
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
        throw new ResponseError(404, 'Link not found');
    }

    return {
        ...link,
        has_password: !!link.password,
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
        throw new ResponseError(500, 'Internal Server Error');
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
        throw new ResponseError(500, 'Internal Server Error');
    }
}

async function getLinks(req) {
    const { userId } = req.auth;

    const page = parseInt(req.query.page ?? 1);
    const limit = parseInt(req.query.limit ?? 10);
    const skip = (page - 1) * limit;

    const links = await prismaClient.link.findMany({
        where: {user_id: userId,},
        orderBy: { created_at: 'desc' },
        skip: skip,
        take: limit,
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

    const total = await prismaClient.link.count({ where: { user_id: userId } });

    if (total === 0) {
        return {
            message: 'You haven’t created any links yet',
            data: [],
        };
    }

    return {
        data: links.map(link => ({
            ...link,
            has_password: !!link.password,
            password: undefined,
        })),
        paging: {
            page,
            limit,
            totalItem: total,
            totalPage: Math.ceil(total / limit),
        },
    };
}

async function verifyLinkPassword(link, password) {
    if (link.has_password) {
        if (!password) {
            throw new ResponseError(401, 'Password is required');
        }

        const isValid = await bcrypt.compare(password, link.password);
        if (!isValid) {
            throw new ResponseError(401, 'Incorrect password');
        }
    }
    return true;
}

async function validateLinkAccess(link, password) {
    if (link.expired_at && new Date(link.expired_at) < new Date()) {
        throw new ResponseError(410, 'Link has expired');
    }

    await verifyLinkPassword(link, password);
}

export default {
    createLink,
    getLinkByShortCode,
    updateLink,
    deleteLink,
    getLinks,
    validateLinkAccess
}