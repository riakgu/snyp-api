import {prisma} from "../src/config/prisma.js";
import * as bcrypt from "bcrypt";

export const clearUserTable = async () => {
    await prisma.user.deleteMany({});
};

export const removeTestUser = async () => {
    await prisma.user.deleteMany({
        where: {
            email: "test@gmail.com",
        }
    })
}

export const createTestUser = async () => {
    return prisma.user.create({
        data: {
            email: "test@gmail.com",
            password: await bcrypt.hash("supersecret", 10),
            name: "test",
        },
        select: {
            id: true
        }
    })
}

export const clearLinkTable = async () => {
    await prisma.link.deleteMany({});
};

export const removeTestLink = async () => {
    await prisma.link.deleteMany({
        where: {
            short_code: "test",
        }
    })

    await removeTestUser();
}

export const createTestLink = async () => {

    const register = await createTestUser();

    await prisma.link.create({
        data: {
            long_url: "https://riakgu.com",
            short_code: "test",
            user_id: register.id,
            stats: { create: {} }
        }
    })
}