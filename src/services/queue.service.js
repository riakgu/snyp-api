import { getChannel, STATS_QUEUE } from '../config/rabbitmq.js';
import { logger } from "../utils/logging.js";

async function publishVisitEvent(data) {
    try {
        const channel = getChannel();
        const message = {
            shortCode: data.shortCode,
            isFromQR: data.isFromQR,
            isUnique: data.isUnique,
            referrer: data.referrer,
            browser: data.browser,
            os: data.os,
            device: data.device,
            country: data.country,
            city: data.city,
            timestamp: new Date().toISOString(),
        };

        const content = Buffer.from(JSON.stringify(message));

        channel.sendToQueue(
            STATS_QUEUE,
            content,
            {
                persistent: true,
            }
        );

        return true;
    } catch (err) {
        logger.error('Error publishing visit event:', err);
        return false;
    }
}

export default {
    publishVisitEvent,
};