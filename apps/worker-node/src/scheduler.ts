import { Pool } from 'pg';
import { Db } from 'mongodb';
import { Logger } from 'pino';
import { aggregateReport } from './aggregator';

export async function scheduleReports(
  pg: Pool, mongo: Db, logger: Logger, intervalMs: number
): Promise<void> {
  // Run immediately on startup
  await run(pg, mongo, logger);

  // Then every intervalMs milliseconds
  setInterval(() => run(pg, mongo, logger), intervalMs);
}

async function run(pg: Pool, mongo: Db, logger: Logger) {
  try {
    logger.info('Running report aggregation...');
    const start = Date.now();
    await aggregateReport(pg, mongo, logger);
    logger.info({ durationMs: Date.now() - start }, 'Report complete');
  } catch (err) {
    logger.error({ err }, 'Report aggregation failed');
  }
}