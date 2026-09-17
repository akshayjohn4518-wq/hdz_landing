import { Request, Response } from 'express';
import { query } from '../db/connection.js';

export const getBuildLogs = async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM build_logs ORDER BY published_at DESC');
    return res.json({ success: true, buildLogs: result.rows });
  } catch (err: unknown) {
    console.error('getBuildLogs error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch build logs' });
  }
};

export const createBuildLog = async (req: Request, res: Response) => {
  try {
    const { title, slug, version, summary, content, author, tags } = req.body;
    const result = await query(
      `INSERT INTO build_logs (title, slug, version, summary, content, author, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, slug, version || '1.0.0', summary || '', content || '', author || 'Operator', tags || []]
    );
    return res.status(201).json({ success: true, buildLog: result.rows[0] });
  } catch (err: unknown) {
    console.error('createBuildLog error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create build log' });
  }
};

export const deleteBuildLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM build_logs WHERE id::text = $1', [id]);
    return res.json({ success: true, message: 'Build log deleted' });
  } catch (err: unknown) {
    console.error('deleteBuildLog error:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete build log' });
  }
};
