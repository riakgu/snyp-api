import app from './app.js';
import { startStatsFlushJob } from './jobs/statsFlush.job.js';
import {logger} from "./utils/logging.js";
import {gracefulShutdown} from "./utils/gracefulShutdown.js";
import config from "./config/index.js";

startStatsFlushJob();

app.listen(config.app.port, config.app.host, () => {
    logger.info(`Server running on ${config.app.host}:${config.app.port}`);
    logger.info(`Environment: ${config.app.env}`);
});

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));