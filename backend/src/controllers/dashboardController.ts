import { Request, Response } from 'express';
import { query, checkDbConnection } from '../db/connection.js';

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const [productsCountRes, contactsCountRes, missionsCountRes, dbHealth] = await Promise.all([
      query(`
        SELECT 
          COUNT(*) as total, 
          COUNT(*) FILTER (WHERE status = 'published') as active 
        FROM products
      `),
      query(`
        SELECT 
          COUNT(*) as total, 
          COUNT(*) FILTER (WHERE status = 'in_review' OR status = 'new') as pending 
        FROM contacts
      `),
      query(`
        SELECT 
          COUNT(*) as total, 
          COUNT(*) FILTER (WHERE status = 'deployed') as deployed 
        FROM missions
      `),
      checkDbConnection(),
    ]);

    const productsTotal = parseInt(productsCountRes.rows[0].total, 10);
    const productsActive = parseInt(productsCountRes.rows[0].active, 10);

    const contactsTotal = parseInt(contactsCountRes.rows[0].total, 10);
    const contactsPending = parseInt(contactsCountRes.rows[0].pending, 10);

    const missionsTotal = parseInt(missionsCountRes.rows[0].total, 10);
    const missionsDeployed = parseInt(missionsCountRes.rows[0].deployed, 10);

    const stats = [
      {
        label: 'Products',
        count: String(productsTotal).padStart(2, '0'),
        unit: 'Active',
        delta: `+${productsActive} this cycle`,
        coord: 'REG: 01',
      },
      {
        label: 'Contacts',
        count: String(contactsTotal).padStart(2, '0'),
        unit: 'Inquiries',
        delta: `${contactsPending} awaiting review`,
        coord: 'MSG: 02',
      },
      {
        label: 'Missions',
        count: String(missionsTotal).padStart(2, '0'),
        unit: 'Deployed',
        delta: `${missionsDeployed} deployed dispatch`,
        coord: 'OPS: 03',
      },
    ];

    return res.json({
      success: true,
      stats,
      health: {
        status: dbHealth.connected ? 'OPERATIONAL' : 'DEGRADED',
        uptime: '99.98%',
        edgeLatency: `${dbHealth.latencyMs}ms`,
        network: 'GLOBAL POPS',
      },
    });
  } catch (err: unknown) {
    console.error('getDashboardStats error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve dashboard stats' });
  }
};

export const getRecentActivities = async (_req: Request, res: Response) => {
  try {
    const activitiesRes = await query(
      'SELECT id, type, title, meta, badge_label, badge_variant, created_at FROM system_activities ORDER BY created_at DESC LIMIT 10'
    );

    const activities = activitiesRes.rows.map((row) => {
      const elapsedMs = Date.now() - new Date(row.created_at).getTime();
      let timestamp = 'Just now';
      const minutes = Math.floor(elapsedMs / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) timestamp = `${days}d ago`;
      else if (hours > 0) timestamp = `${hours}h ago`;
      else if (minutes > 0) timestamp = `${minutes}m ago`;

      return {
        id: row.id,
        type: row.type,
        title: row.title,
        meta: row.meta,
        timestamp,
        badge: {
          label: row.badge_label,
          variant: row.badge_variant,
        },
      };
    });

    return res.json({
      success: true,
      activities,
    });
  } catch (err: unknown) {
    console.error('getRecentActivities error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve activities' });
  }
};
