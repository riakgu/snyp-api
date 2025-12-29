import { close as closePrisma } from './prisma.js';
import { close as closeRedis } from './redis.js';
import { close as closeRabbitMQ } from './rabbitmq.js';
import { logger } from './logger.js';

export async function shutdown(signal) {
    logger.info(`${signal} received. Shutting down gracefully...`);

    try {
        await closeRabbitMQ();
        await closePrisma();
        await closeRedis();

        logger.info('Graceful shutdown complete');
        process.exit(0);
    } catch (err) {
        logger.error('Error during graceful shutdown:', err);
        process.exit(1);
    }
}