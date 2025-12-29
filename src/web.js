import app from './config/express.js';
import { logger } from "./config/logger.js";
import config from "./config/index.js";
import { shutdown } from "./config/shutdown.js";
import { connect as connectRabbitMQ } from "./config/rabbitmq.js";

await connectRabbitMQ();

app.listen(config.app.port, config.app.host, () => {
    logger.info(`Server running on ${config.app.host}:${config.app.port}`);
    logger.info(`Environment: ${config.app.env}`);
});

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));