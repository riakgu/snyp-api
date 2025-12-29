import amqp from 'amqplib';
import config from "./index.js";
import { logger } from "./logger.js";

let connection = null;
let channel = null;

export const STATS_QUEUE = 'stats_queue';

export async function connectRabbitMQ() {
    try {
        connection = await amqp.connect(config.rabbitMQ.url);
        channel = await connection.createChannel();

        await channel.assertQueue(STATS_QUEUE, {
            durable: true,
        });

        logger.info('RabbitMQ connected');

        connection.on('error', (err) => {
            logger.error('RabbitMQ connection error:', err);
        });

        connection.on('close', () => {
            logger.info('RabbitMQ connection closed, reconnecting...');
            setTimeout(connectRabbitMQ, 5000);
        });

    } catch (error) {
        logger.error('Failed to connect to RabbitMQ:', error);
        setTimeout(connectRabbitMQ, 5000);
    }
}

export function getChannel() {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized');
    }
    return channel;
}

export async function closeRabbitMQ() {
    try {
        if (channel) await channel.close();
        if (connection) await connection.close();
        logger.info('RabbitMQ connection closed');
    } catch (error) {
        logger.error('Error closing RabbitMQ:', error);
    }
}