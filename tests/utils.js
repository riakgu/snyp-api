import {prismaClient} from "../src/config/prisma.js";
import * as bcrypt from "bcrypt";

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            email: "test@gmail.com",
        }
    })
}

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            email: "test@gmail.com",
            password: await bcrypt.hash("supersecret", 10),
            name: "test",
        }
    })
}