import { PrismaClient } from '@prisma/client';
import {logger} from "./logger.js";

export const prisma = new PrismaClient({
    log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
    ],
});

prisma.$on('error', (err) => {
    logger.error(err);
});

prisma.$on('warn', (err) => {
    logger.warn(err);
});

prisma.$on('info', (err) => {
    logger.info(err);
});

prisma.$on('query', (err) => {
    logger.info(err);
});
