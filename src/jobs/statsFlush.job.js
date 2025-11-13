import cron from 'node-cron';
import statsService from '../services/stats.service.js';
import {logger} from "../utils/logging.js";

export function startStatsFlushJob() {
    cron.schedule('*/5 * * * *', async () => {
        logger.info('Running stats flush job...');
        try {
            await statsService.flushStatsToDatabase();
        } catch (error) {
            logger.error('Stats flush job failed:', error);
        }
    });

    logger.info('Stats flush job scheduled (every 5 minutes)');
}