import { Request, Response } from 'express';
import { query } from '../db/connection.js';

export const getTeam = async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM team_members ORDER BY order_index ASC, created_at ASC');
    return res.json({ success: true, team: result.rows });
  } catch (err: unknown) {
    console.error('getTeam error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch team members' });
  }
};

export const createTeamMember = async (req: Request, res: Response) => {
  try {
    const { name, role, bio, avatar_url, order_index } = req.body;
    const result = await query(
      `INSERT INTO team_members (name, role, bio, avatar_url, order_index)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, role, bio || '', avatar_url || '', order_index || 0]
    );
    return res.status(201).json({ success: true, member: result.rows[0] });
  } catch (err: unknown) {
    console.error('createTeamMember error:', err);
    return res.status(500).json({ success: false, error: 'Failed to add team member' });
  }
};
