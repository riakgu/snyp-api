import statsService from '../services/stats.service.js';
import { prismaClient } from '../config/database.js';
import { redis } from '../config/cache.js';
import { logger } from './logging.js';

export async function gracefulShutdown(signal) {
    logger.info(`${signal} received. Shutting down gracefully...`);

    try {
        logger.info('Flushing pending stats...');
        await statsService.flushStatsToDatabase();

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