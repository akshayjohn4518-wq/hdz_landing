import { Request, Response } from 'express';
import { query } from '../db/connection.js';
import { hashPassword, verifyPassword } from '../utils/security.js';

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password, name, role } = req.body;

    if (!username || !email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Operator username, email, password, and full name are required.',
      });
    }

    const cleanUser = String(username).trim().toLowerCase();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPass = String(password).trim();
    const cleanName = String(name).trim();
    const userRole = role && ['SUPER ADMIN', 'ADMIN', 'OPERATOR'].includes(role) ? role : 'SUPER ADMIN';

    if (cleanUser.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Operator username must be at least 3 characters.',
      });
    }

    if (cleanPass.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Security key must be at least 6 characters long.',
      });
    }

    // Check if username or email is already taken
    const existing = await query(
      'SELECT id, username, email FROM users WHERE LOWER(username) = $1 OR LOWER(email) = $2',
      [cleanUser, cleanEmail]
    );

    if (existing.rows.length > 0) {
      const match = existing.rows[0];
      if (match.username.toLowerCase() === cleanUser) {
        return res.status(409).json({
          success: false,
          error: 'An operator with this username already exists in the system.',
        });
      }
      return res.status(409).json({
        success: false,
        error: 'An operator with this email address already exists.',
      });
    }

    // Hash password
    const passwordHash = hashPassword(cleanPass);

    // Insert user into Supabase PostgreSQL
    const insertRes = await query(
      `INSERT INTO users (username, password_hash, name, role, email, last_login_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id, username, name, role, email, last_login_at, created_at`,
      [cleanUser, passwordHash, cleanName, userRole, cleanEmail]
    );

    const newUser = insertRes.rows[0];
    const ipAddress = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') as string;
    const userAgent = (req.headers['user-agent'] || 'Direct Client') as string;

    // Record initial login in user_logins table
    await query(
      `INSERT INTO user_logins (user_id, ip_address, user_agent)
       VALUES ($1, $2, $3)`,
      [newUser.id, ipAddress, userAgent]
    );

    // Record system activity
    await query(
      `INSERT INTO system_activities (type, title, meta, badge_label, badge_variant, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        'operator_registered',
        `New operator registered: ${cleanName}`,
        `Assigned credentials for ${cleanUser} (${userRole})`,
        'REGISTERED',
        'operational',
        newUser.id,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Operator account initialized successfully.',
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        role: newUser.role,
        email: newUser.email,
        last_login_at: newUser.last_login_at,
      },
    });
  } catch (err: unknown) {
    console.error('Signup error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to complete operator registration in Supabase.',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and security passphrase are required.',
      });
    }

    const cleanUser = String(username).trim().toLowerCase();
    const cleanPass = String(password).trim();

    // Query user by username or email
    const userRes = await query(
      `SELECT id, username, password_hash, name, role, email, last_login_at 
       FROM users 
       WHERE LOWER(username) = $1 OR LOWER(email) = $1`,
      [cleanUser]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Operator not found. Access restricted to authorized operators.',
      });
    }

    const user = userRes.rows[0];

    // Verify hashed password
    const isMatch = verifyPassword(cleanPass, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid security key. Access denied.',
      });
    }

    const ipAddress = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') as string;
    const userAgent = (req.headers['user-agent'] || 'Direct Client') as string;

    // 1. Record login in user_logins table
    await query(
      `INSERT INTO user_logins (user_id, ip_address, user_agent)
       VALUES ($1, $2, $3)`,
      [user.id, ipAddress, userAgent]
    );

    // 2. Update last_login_at in users table
    const updateRes = await query(
      `UPDATE users 
       SET last_login_at = NOW(), updated_at = NOW() 
       WHERE id = $1 
       RETURNING last_login_at`,
      [user.id]
    );

    const latestLoginAt = updateRes.rows[0]?.last_login_at || new Date().toISOString();

    // 3. Record system activity
    await query(
      `INSERT INTO system_activities (type, title, meta, badge_label, badge_variant, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        'operator_login',
        `Operator session active: ${user.name}`,
        `IP: ${ipAddress.split(',')[0]} • Role: ${user.role}`,
        'SESSION',
        'operational',
        user.id,
      ]
    );

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
        last_login_at: latestLoginAt,
      },
    });
  } catch (err: unknown) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      error: 'Authentication failure during database lookup.',
    });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        u.id, 
        u.username, 
        u.name, 
        u.role, 
        u.email, 
        u.last_login_at, 
        u.created_at,
        COUNT(ul.id) as login_count
      FROM users u
      LEFT JOIN user_logins ul ON ul.user_id = u.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    return res.json({ success: true, users: result.rows });
  } catch (err: unknown) {
    console.error('getUsers error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve operator accounts.' });
  }
};

export const getUserLogins = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    let sql = `
      SELECT 
        ul.id, 
        ul.user_id, 
        u.username, 
        u.name, 
        u.role, 
        ul.ip_address, 
        ul.user_agent, 
        ul.created_at 
      FROM user_logins ul
      JOIN users u ON u.id = ul.user_id
    `;
    const params: unknown[] = [];
    if (userId) {
      params.push(userId);
      sql += ' WHERE ul.user_id = $1';
    }
    sql += ' ORDER BY ul.created_at DESC LIMIT 50';

    const result = await query(sql, params);
    return res.json({ success: true, logins: result.rows });
  } catch (err: unknown) {
    console.error('getUserLogins error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve login history.' });
  }
};
