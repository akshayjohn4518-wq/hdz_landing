import { Request, Response } from 'express';
import { query } from '../db/connection.js';

export const getMissions = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM missions WHERE 1=1';
    const params: unknown[] = [];

    if (status) {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    sql += ' ORDER BY order_index ASC, created_at DESC';

    const result = await query(sql, params);
    return res.json({ success: true, missions: result.rows });
  } catch (err: unknown) {
    console.error('getMissions error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch missions' });
  }
};

export const getMissionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM missions WHERE id::text = $1 OR slug = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Mission not found' });
    }

    return res.json({ success: true, mission: result.rows[0] });
  } catch (err: unknown) {
    console.error('getMissionById error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch mission' });
  }
};

export const createMission = async (req: Request, res: Response) => {
  try {
    const { title, slug, milestone, status, summary, telemetry } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ success: false, error: 'Title and slug are required' });
    }

    const result = await query(
      `INSERT INTO missions (title, slug, milestone, status, summary, telemetry)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        title,
        slug,
        milestone || '',
        status || 'planning',
        summary || '',
        JSON.stringify(telemetry || {}),
      ]
    );

    await query(
      `INSERT INTO system_activities (type, title, meta, badge_label, badge_variant)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        'mission_updated',
        `Mission ${title} initialized`,
        `Milestone set to ${milestone || 'planning'}`,
        'MISSION',
        'neutral',
      ]
    );

    return res.status(201).json({ success: true, mission: result.rows[0] });
  } catch (err: unknown) {
    console.error('createMission error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create mission' });
  }
};

export const updateMission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug, milestone, status, summary, telemetry } = req.body;

    const result = await query(
      `UPDATE missions
       SET title = COALESCE($1, title),
           slug = COALESCE($2, slug),
           milestone = COALESCE($3, milestone),
           status = COALESCE($4, status),
           summary = COALESCE($5, summary),
           telemetry = COALESCE($6, telemetry),
           updated_at = NOW()
       WHERE id::text = $7 OR slug = $7
       RETURNING *`,
      [
        title,
        slug,
        milestone,
        status,
        summary,
        telemetry ? JSON.stringify(telemetry) : null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Mission not found' });
    }

    return res.json({ success: true, mission: result.rows[0] });
  } catch (err: unknown) {
    console.error('updateMission error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update mission' });
  }
};

export const deleteMission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM missions WHERE id::text = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Mission not found' });
    }

    return res.json({ success: true, message: 'Mission deleted successfully' });
  } catch (err: unknown) {
    console.error('deleteMission error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete mission' });
  }
};
