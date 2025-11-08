import {prismaClient} from "../src/config/prisma.js";

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            email: "test@gmail.com",
        }
    })
}