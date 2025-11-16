import { prismaClient } from '../config/database.js';
import { redis } from '../config/redis.js';
import { logger } from './logging.js';
import {closeRabbitMQ} from "../config/rabbitmq.js";

export async function gracefulShutdown(signal) {
    logger.info(`${signal} received. Shutting down gracefully...`);

    try {
        logger.info('Closing RabbitMQ connection...');
        await closeRabbitMQ();

        logger.info('Closing Prisma connection...');
        await prismaClient.$disconnect();

        logger.info('Closing Redis connection...');
        await redis.quit();

        logger.info('Graceful shutdown complete');
        process.exit(0);

    } catch (err) {
        logger.error('Error during graceful shutdown:', err);
        process.exit(1);
    }
}