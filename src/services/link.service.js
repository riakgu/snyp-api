import {validate} from "../utils/validators.js";
import {prismaClient} from "../config/database.js";
import {createLinkAuthValidation, createLinkValidation, updateLinkValidation} from "../validations/link.validation.js";
import {ResponseError} from "../errors/response.error.js";
import * as bcrypt from "bcrypt";
import cacheService from "./cache.service.js";
import {generateShortCode} from "../utils/shortCode.js";

async function createLink(req) {
    const isAuth = !!req.auth;
    const schema = isAuth ? createLinkAuthValidation : createLinkValidation;
    const data = validate(schema, req.body);
    const customCode = data.short_code ?? null;
    const passwordHash = data.password ? await bcrypt.hash(data.password, 10) : null;

    const MAX_RETRIES = 100;

    for (const attempt of Array(MAX_RETRIES).keys()) {
        const shortCode = customCode ?? generateShortCode(5);

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
                    archived_at: true
                }
            });

            return {
                ...link,
                has_password: !!link.password,
                is_archived: !!link.archived_at,
                password: undefined,
                archived_at: undefined,
            };
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

    const cached = await cacheService.getCachedLink(shortCode);
    if (cached) {
        return {
            ...cached,
            has_password: !!cached.password,
            is_archived: !!cached.archived_at,
        };
    }

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
            archived_at: true,
        }
    });

    if (!link) {
        throw new ResponseError(404, 'Link not found');
    }

    await cacheService.cacheLink(shortCode, link);

    return {
        ...link,
        has_password: !!link.password,
        is_archived: !!link.archived_at,
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
                archived_at: true,
            }
        });

        await cacheService.invalidateLinkCache(shortCode);
        await cacheService.invalidateQRCache(shortCode);

        if (customCode !== shortCode) {
            await cacheService.invalidateLinkCache(customCode);
        }

        return {
            ...link,
            has_password: !!link.password,
            is_archived: !!link.archived_at,
            password: undefined,
            archived_at: undefined,
        };
    } catch (err) {
        if (err.code === 'P2002') {
            throw new ResponseError(400, 'Short code already taken');
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
        const result = await prismaClient.link.delete({
            where: {
                short_code: shortCode,
                user_id: userId,
            },
        });

        await cacheService.invalidateLinkCache(shortCode);
        await cacheService.invalidateQRCache(shortCode);

        return result;
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
        where: { user_id: userId, archived_at: null},
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
            archived_at: true,
        }
    });

    const total = await prismaClient.link.count({ where: { user_id: userId, archived_at: null} });

    if (total === 0) {
        return {
            message: 'You haven\'t created any links yet',
            data: [],
        };
    }

    return {
        data: links.map(link => ({
            ...link,
            has_password: !!link.password,
            is_archived: !!link.archived_at,
            password: undefined,
            archived_at: undefined,
        })),
        paging: {
            page,
            limit,
            totalItem: total,
            totalPage: Math.ceil(total / limit),
        },
    };
}

async function validateLinkAccess(link) {
    if (link.is_archived) {
        throw new ResponseError(410, 'Link has archived');
    }

    if (link.expired_at && new Date(link.expired_at) < new Date()) {
        throw new ResponseError(410, 'Link has expired');
    }

    return true;
}

async function archiveLink(req) {
    const { userId } = req.auth;
    const { shortCode } = req.params;

    try {
        const result = await prismaClient.link.update({
            where: {
                short_code: shortCode,
                user_id: userId,
            },
            data: {
                archived_at: new Date(),
            }
        });

        await cacheService.invalidateLinkCache(shortCode);
        await cacheService.invalidateQRCache(shortCode);

        return result;
    } catch (err) {
        if (err.code === 'P2025') {
            throw new ResponseError(404, 'Link not found');
        }
        throw new ResponseError(500, 'Internal Server Error');
    }
}

async function getArchivedLinks(req) {
    const { userId } = req.auth;

    const page = parseInt(req.query.page ?? 1);
    const limit = parseInt(req.query.limit ?? 10);
    const skip = (page - 1) * limit;

    const links = await prismaClient.link.findMany({
        where: {
            user_id: userId,
            archived_at: {not: null}
        },
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
            archived_at: true,
        }
    });

    const total = await prismaClient.link.count({
        where: {
            user_id: userId,
            archived_at: {not: null}
        }});

    if (total === 0) {
        return {
            message: 'You don\'t have any archived links',
            data: [],
        };
    }

    return {
        data: links.map(link => ({
            ...link,
            has_password: !!link.password,
            is_archived: !!link.archived_at,
            password: undefined,
            archived_at: undefined,
        })),
        paging: {
            page,
            limit,
            totalItem: total,
            totalPage: Math.ceil(total / limit),
        },
    };
}

async function unarchiveLink(req) {
    const { userId } = req.auth;
    const { shortCode } = req.params;

    try {
        const result = await prismaClient.link.update({
            where: {
                short_code: shortCode,
                user_id: userId,
            },
            data: {
                archived_at: null,
            }
        });

        await cacheService.invalidateLinkCache(shortCode);
        await cacheService.invalidateQRCache(shortCode);

        return result;
    } catch (err) {
        if (err.code === 'P2025') {
            throw new ResponseError(404, 'Link not found');
        }
        throw new ResponseError(500, 'Internal Server Error');
    }
}

export default {
    createLink,
    getLinkByShortCode,
    updateLink,
    deleteLink,
    getLinks,
    archiveLink,
    getArchivedLinks,
    unarchiveLink,
    validateLinkAccess,
}