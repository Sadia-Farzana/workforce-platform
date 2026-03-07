import pino from 'pino';
import { Pool } from 'pg';
import { MongoClient, Db } from 'mongodb';
import { scheduleReports } from './scheduler';
import { connectRabbitMQ } from './rabbitmq';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
});

async function main() {
  logger.info('Starting Report Worker...');

  // PostgreSQL
  const pg = new Pool({
    connectionString: process.env.POSTGRES_URI
      || 'postgresql://wfp:wfp_secret@localhost:5432/workforce'
  });
  await pg.query('SELECT 1');
  logger.info('PostgreSQL connected');

  // MongoDB
  const mongoClient = new MongoClient(
    process.env.MONGODB_URI
      || 'mongodb://wfp:wfp_secret@localhost:27017/workforce?authSource=admin'
  );
  await mongoClient.connect();
  const mongo: Db = mongoClient.db();
  logger.info('MongoDB connected');

  // RabbitMQ (optional — worker still runs without it)
  try {
    await connectRabbitMQ(
      process.env.RABBITMQ_URI
        || 'amqp://wfp:wfp_secret@localhost:5672/workforce',
      pg, mongo, logger
    );
    logger.info('RabbitMQ connected');
  } catch (err) {
    logger.warn({ err }, 'RabbitMQ unavailable — scheduled reports only');
  }

  // Start scheduler
  const intervalMs = parseInt(process.env.REPORT_INTERVAL_MS || '300000');
  await scheduleReports(pg, mongo, logger, intervalMs);

  // Graceful shutdown
  process.on('SIGINT',  async () => { await pg.end(); await mongoClient.close(); process.exit(0); });
  process.on('SIGTERM', async () => { await pg.end(); await mongoClient.close(); process.exit(0); });
}

main().catch(err => {
  logger.error({ err }, 'Fatal error');
  process.exit(1);
});