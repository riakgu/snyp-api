import { connectRabbitMQ } from './config/rabbitmq.js';
import { startStatsWorker } from "./workers/stats.worker.js";
import {shutdown} from "./config/shutdown.js";

await connectRabbitMQ();
await startStatsWorker();

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));