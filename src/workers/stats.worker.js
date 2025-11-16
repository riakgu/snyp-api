import {getChannel, STATS_QUEUE} from '../config/rabbitmq.js';
import statsService from '../services/stats.service.js';
import {logger} from "../utils/logging.js";

export async function startStatsWorker() {
    const channel = getChannel();

    await channel.prefetch(1);

    logger.info('Stats worker started, waiting for messages...');

    channel.consume(
        STATS_QUEUE,
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
        {
            noAck: false
        }
    );
}

