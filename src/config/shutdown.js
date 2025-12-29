import { prisma } from './prisma.js';
import { redis } from './redis.js';
import { logger } from './logger.js';
import { closeRabbitMQ } from "./rabbitmq.js";

export async function shutdown(signal) {
    logger.info(`${signal} received. Shutting down gracefully...`);

    try {
        logger.info('Closing RabbitMQ connection...');
        await closeRabbitMQ();

        logger.info('Closing Prisma connection...');
        await prisma.$disconnect();

        logger.info('Closing Redis connection...');
        await redis.quit();

        logger.info('Graceful shutdown complete');
        process.exit(0);

    } catch (err) {
        logger.error('Error during graceful shutdown:', err);
        process.exit(1);
    }
}