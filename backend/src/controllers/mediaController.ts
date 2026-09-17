import { Request, Response } from 'express';
import { query } from '../db/connection.js';

export const getMedia = async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM media_assets ORDER BY created_at DESC');
    return res.json({ success: true, media: result.rows });
  } catch (err: unknown) {
    console.error('getMedia error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch media assets' });
  }
};

export const createMedia = async (req: Request, res: Response) => {
  try {
    const { name, url, file_type, size_bytes, alt_text } = req.body;
    const result = await query(
      `INSERT INTO media_assets (name, url, file_type, size_bytes, alt_text)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, url, file_type || 'image', size_bytes || 0, alt_text || '']
    );
    return res.status(201).json({ success: true, media: result.rows[0] });
  } catch (err: unknown) {
    console.error('createMedia error:', err);
    return res.status(500).json({ success: false, error: 'Failed to save media asset' });
  }
};
