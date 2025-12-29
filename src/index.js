import app from './app.js';
import { logger } from "./config/logger.js";
import config from "./config/index.js";
import { gracefulShutdown } from "./utils/gracefulShutdown.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";

await connectRabbitMQ();

app.listen(config.app.port, config.app.host, () => {
    logger.info(`Server running on ${config.app.host}:${config.app.port}`);
    logger.info(`Environment: ${config.app.env}`);
});

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));