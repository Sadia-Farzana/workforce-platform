import amqp from 'amqplib';
import { Pool } from 'pg';
import { Db } from 'mongodb';
import { Logger } from 'pino';
import { aggregateReport } from './aggregator';

const TRIGGER_QUEUES = [
  'employee-created-event',
  'employee-updated-event',
  'project-created-event',
  'leave-request-submitted-event',
  'leave-status-changed-event',
];

export async function connectRabbitMQ(
  uri: string, pg: Pool, mongo: Db, logger: Logger
): Promise<void> {
  const conn    = await amqp.connect(uri);
  const channel = await conn.createChannel();

  for (const queue of TRIGGER_QUEUES) {
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, async (msg) => {
      if (!msg) return;
      try {
        logger.debug({ queue }, 'Trigger received — refreshing report');
        await aggregateReport(pg, mongo, logger);
        channel.ack(msg);
      } catch (err) {
        logger.error({ err }, 'Failed to process trigger');
        channel.nack(msg, false, true); // requeue
      }
    });
  }

  conn.on('error', err => logger.error({ err }, 'RabbitMQ error'));
}