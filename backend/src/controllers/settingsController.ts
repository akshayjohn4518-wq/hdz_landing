import { Request, Response } from 'express';
import { query } from '../db/connection.js';

export const getSettings = async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT key, value, updated_at FROM system_settings');
    const settingsMap: Record<string, unknown> = {};
    for (const row of result.rows) {
      settingsMap[row.key] = row.value;
    }
    return res.json({ success: true, settings: settingsMap });
  } catch (err: unknown) {
    console.error('getSettings error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const result = await query(
      `INSERT INTO system_settings (key, value, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE
       SET value = EXCLUDED.value, updated_at = NOW()
       RETURNING *`,
      [key, JSON.stringify(value)]
    );

    return res.json({ success: true, setting: result.rows[0] });
  } catch (err: unknown) {
    console.error('updateSettings error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update setting' });
  }
};
