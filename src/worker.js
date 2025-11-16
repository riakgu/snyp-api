import { connectRabbitMQ } from './config/rabbitmq.js';
import { startStatsWorker } from "./workers/stats.worker.js";
import {gracefulShutdown} from "./utils/gracefulShutdown.js";

await connectRabbitMQ();
await startStatsWorker();

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));