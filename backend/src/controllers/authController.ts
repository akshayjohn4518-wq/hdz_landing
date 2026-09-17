import { Request, Response } from 'express';
import { query } from '../db/connection.js';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required',
      });
    }

    const cleanUser = String(username).trim().toLowerCase();
    const cleanPass = String(password).trim();

    // Query operator from Supabase database
    const userRes = await query(
      'SELECT id, username, password_hash, name, role, email FROM users WHERE LOWER(username) = $1',
      [cleanUser]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Access restricted to authorized operators.',
      });
    }

    const user = userRes.rows[0];

    // Check password (matches dayzero demo password or direct password check)
    if (user.password_hash !== cleanPass) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Access restricted to authorized operators.',
      });
    }

    // Return authenticated user payload
    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err: unknown) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      error: 'Authentication failure on database query',
    });
  }
};
