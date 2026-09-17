import { Request, Response } from 'express';
import { query } from '../db/connection.js';

export const getChapters = async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM chapters ORDER BY chapter_number ASC');
    return res.json({ success: true, chapters: result.rows });
  } catch (err: unknown) {
    console.error('getChapters error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch chapters' });
  }
};

export const createChapter = async (req: Request, res: Response) => {
  try {
    const { chapter_number, title, slug, excerpt, content, read_time, status } = req.body;
    const result = await query(
      `INSERT INTO chapters (chapter_number, title, slug, excerpt, content, read_time, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [chapter_number || 1, title, slug, excerpt || '', content || '', read_time || '5 min read', status || 'draft']
    );
    return res.status(201).json({ success: true, chapter: result.rows[0] });
  } catch (err: unknown) {
    console.error('createChapter error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create chapter' });
  }
};
