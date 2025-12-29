import { getChannel, QUEUES } from '../config/rabbitmq.js';
import { logger } from "../config/logger.js";
import statsService from '../services/stats.service.js';

export async function startStatsWorker() {
    const channel = getChannel();

    await channel.prefetch(1);

    logger.info('Stats worker started, waiting for messages...');

    channel.consume(
        QUEUES.stats,
        async (msg) => {
            if (!msg) return;

            try {
                const data = JSON.parse(msg.content.toString());
                await statsService.processVisitEvent(data);
                channel.ack(msg);
            } catch (err) {
                logger.error('Error processing visit:', err);
                channel.nack(msg, false, true);
            }
        },
        { noAck: false }
    );
}