import { connect as connectRabbitMQ } from './config/rabbitmq.js';
import { shutdown } from "./config/shutdown.js";
import { startStatsWorker } from "./workers/stats.worker.js";

await connectRabbitMQ();
await startStatsWorker();

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));