import { Pool } from 'pg';
import { Db } from 'mongodb';
import { Logger } from 'pino';

export async function aggregateReport(
  pg: Pool, mongo: Db, logger: Logger
): Promise<void> {

  // ── Headcount from PostgreSQL ──────────────────────────────
  const headcount = await pg.query(`
    SELECT
      COUNT(*)                                    AS total,
      COUNT(*) FILTER (WHERE is_active = true)    AS active
    FROM employees
  `);

  const byDept = await pg.query(`
    SELECT d.name AS department, COUNT(e.id) AS count
    FROM departments d
    LEFT JOIN employees e ON e.department_id = d.id AND e.is_active = true
    GROUP BY d.name
    ORDER BY count DESC
  `);

  // ── Project stats from PostgreSQL ──────────────────────────
  const projects = await pg.query(`
    SELECT
      COUNT(*)                                          AS total,
      COUNT(*) FILTER (WHERE status = 'Active')         AS active,
      COUNT(*) FILTER (WHERE status = 'Completed')      AS completed,
      COUNT(*) FILTER (WHERE status = 'OnHold')         AS on_hold
    FROM projects
  `);

  const tasks = await pg.query(`
    SELECT
      COUNT(*)                                    AS total,
      COUNT(*) FILTER (WHERE status = 'Done')     AS completed
    FROM tasks
  `);

  // ── Leave stats from MongoDB ───────────────────────────────
  const leaveByStatus = await mongo.collection('leave_requests')
    .aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
    .toArray();

  const leaveByType = await mongo.collection('leave_requests')
    .aggregate([
      { $group: { _id: '$leaveType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
    .toArray();

  // ── Recent activity from audit logs ───────────────────────
  const recentActivity = await mongo.collection('audit_logs')
    .find({})
    .sort({ timestamp: -1 })
    .limit(10)
    .toArray();

  // ── Build and save report ──────────────────────────────────
  const statusMap = Object.fromEntries(leaveByStatus.map(s => [s._id, s.count]));
  const h = headcount.rows[0];
  const p = projects.rows[0];
  const t = tasks.rows[0];

  const report = {
    generatedAt: new Date(),
    reportType: 'periodic',
    headcount: {
      total: parseInt(h.total),
      active: parseInt(h.active),
      byDepartment: byDept.rows.map(r => ({
        department: r.department,
        count: parseInt(r.count)
      }))
    },
    projects: {
      total:          parseInt(p.total),
      active:         parseInt(p.active),
      completed:      parseInt(p.completed),
      onHold:         parseInt(p.on_hold),
      totalTasks:     parseInt(t.total),
      completedTasks: parseInt(t.completed)
    },
    leaves: {
      pending:  statusMap['Pending']  || 0,
      approved: statusMap['Approved'] || 0,
      rejected: statusMap['Rejected'] || 0,
      byType: leaveByType.map(t => ({
        leaveType: t._id,
        count: t.count
      }))
    },
    recentActivity: recentActivity.map(a => ({
      description: a.description || `${a.eventType} on ${a.entityType}`,
      timestamp:   a.timestamp,
      entityType:  a.entityType
    }))
  };

  // Upsert — one report per day
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await mongo.collection('summary_reports').replaceOne(
    { reportType: 'periodic', generatedAt: { $gte: today } },
    report,
    { upsert: true }
  );

  logger.info({
    employees: report.headcount.total,
    projects:  report.projects.total,
    pending:   report.leaves.pending
  }, 'Report saved to MongoDB');
}