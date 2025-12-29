import amqp from 'amqplib';
import config from "./index.js";
import { logger } from "./logger.js";

let connection = null;
let channel = null;

export const QUEUES = config.rabbitMQ.queues;

export async function connect() {
    try {
        connection = await amqp.connect(config.rabbitMQ.url);
        channel = await connection.createChannel();

        const queues = Object.values(QUEUES);
        await Promise.all(
            queues.map(q => channel.assertQueue(q, { durable: true }))
        );

        logger.info(`RabbitMQ connected. Queues: ${queues.join(', ')}`);

        connection.on('error', (err) => {
            logger.error('RabbitMQ connection error:', err);
        });

        connection.on('close', () => {
            logger.info('RabbitMQ connection closed, reconnecting...');
            setTimeout(connect, 5000);
        });

    } catch (error) {
        logger.error('Failed to connect to RabbitMQ:', error);
        setTimeout(connect, 5000);
    }
}

export function getChannel() {
    if (!channel) {
        throw new Error('RabbitMQ channel not initialized');
    }
    return channel;
}

export async function close() {
    try {
        if (channel) await channel.close();
        if (connection) await connection.close();
        logger.info('RabbitMQ connection closed');
    } catch (error) {
        logger.error('Error closing RabbitMQ:', error);
    }
}