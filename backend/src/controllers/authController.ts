import { Request, Response } from 'express';
import { pool, query } from '../db/connection.js';
import { hashPassword, verifyPassword } from '../utils/security.js';

export const signup = async (req: Request, res: Response) => {
  const client = await pool.connect();
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

    // 1. Check for existing username in public.users
    const userCheck = await client.query(
      'SELECT id FROM public.users WHERE LOWER(username) = $1',
      [cleanUser]
    );

    if (userCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'An operator with this username already exists.',
      });
    }

    await client.query('BEGIN');

    // 2. Check if user already exists in auth.users
    let authUserId: string;
    const existingAuth = await client.query(
      'SELECT id FROM auth.users WHERE LOWER(email) = LOWER($1)',
      [cleanEmail]
    );

    const userMeta = {
      name: cleanName,
      username: cleanUser,
      role: userRole,
    };

    if (existingAuth.rows.length > 0) {
      // User exists in auth.users, update password & metadata
      authUserId = existingAuth.rows[0].id;
      await client.query(
        `UPDATE auth.users
         SET encrypted_password = extensions.crypt($1, extensions.gen_salt('bf')),
             email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
             raw_user_meta_data = $2::jsonb,
             updated_at = NOW()
         WHERE id = $3`,
        [cleanPass, JSON.stringify(userMeta), authUserId]
      );
    } else {
      // Insert into auth.users (Visible in Supabase Dashboard -> Authentication -> Users!)
      const authUserSql = `
        INSERT INTO auth.users (
          instance_id,
          id,
          aud,
          role,
          email,
          encrypted_password,
          email_confirmed_at,
          raw_app_meta_data,
          raw_user_meta_data,
          created_at,
          updated_at,
          is_sso_user,
          is_anonymous
        ) VALUES (
          '00000000-0000-0000-0000-000000000000',
          gen_random_uuid(),
          'authenticated',
          'authenticated',
          $1,
          extensions.crypt($2, extensions.gen_salt('bf')),
          NOW(),
          '{"provider":"email","providers":["email"]}'::jsonb,
          $3::jsonb,
          NOW(),
          NOW(),
          false,
          false
        )
        RETURNING id;
      `;

      const newAuthRes = await client.query(authUserSql, [
        cleanEmail,
        cleanPass,
        JSON.stringify(userMeta),
      ]);
      authUserId = newAuthRes.rows[0].id;

      // Insert identity into auth.identities
      const identitySql = `
        INSERT INTO auth.identities (
          id,
          user_id,
          identity_data,
          provider,
          provider_id,
          last_sign_in_at,
          created_at,
          updated_at
        ) VALUES (
          gen_random_uuid(),
          $1,
          $2::jsonb,
          'email',
          $1::text,
          NOW(),
          NOW(),
          NOW()
        );
      `;
      await client.query(identitySql, [
        authUserId,
        JSON.stringify({ sub: authUserId, email: cleanEmail }),
      ]);
    }

    // 3. Hash password for public backup verification
    const passwordHash = hashPassword(cleanPass);

    // 4. Insert or update into public.users using the EXACT Supabase auth.users UUID
    const publicUserSql = `
      INSERT INTO public.users (
        id,
        username,
        password_hash,
        name,
        role,
        email,
        last_login_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, NOW()
      )
      ON CONFLICT (id) DO UPDATE
      SET username = EXCLUDED.username,
          password_hash = EXCLUDED.password_hash,
          name = EXCLUDED.name,
          role = EXCLUDED.role,
          email = EXCLUDED.email,
          last_login_at = NOW()
      RETURNING id, username, name, role, email, last_login_at, created_at;
    `;

    const publicRes = await client.query(publicUserSql, [
      authUserId,
      cleanUser,
      passwordHash,
      cleanName,
      userRole,
      cleanEmail,
    ]);

    const newUser = publicRes.rows[0];
    const ipAddress = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') as string;
    const userAgent = (req.headers['user-agent'] || 'Direct Client') as string;

    // 5. Record initial login in user_logins
    await client.query(
      `INSERT INTO user_logins (user_id, ip_address, user_agent)
       VALUES ($1, $2, $3)`,
      [newUser.id, ipAddress, userAgent]
    );

    // 6. Record in system_activities
    await client.query(
      `INSERT INTO system_activities (type, title, meta, badge_label, badge_variant, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        'operator_registered',
        `New operator registered: ${cleanName}`,
        `Registered in Supabase Auth (${userRole})`,
        'REGISTERED',
        'operational',
        newUser.id,
      ]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Operator registered in Supabase Authentication successfully.',
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
    await client.query('ROLLBACK');
    console.error('Signup error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to complete operator registration in Supabase.',
    });
  } finally {
    client.release();
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

    const cleanIdentifier = String(username).trim().toLowerCase();
    const cleanPass = String(password).trim();

    // 1. Find user in public.users (by username or email)
    const userRes = await query(
      `SELECT id, username, password_hash, name, role, email, last_login_at 
       FROM public.users 
       WHERE LOWER(username) = $1 OR LOWER(email) = $1`,
      [cleanIdentifier]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Operator not found. Access restricted to authorized operators.',
      });
    }

    const user = userRes.rows[0];

    // 2. Verify password (check salted hash or auth.users crypt)
    let isMatch = verifyPassword(cleanPass, user.password_hash);
    if (!isMatch) {
      // Check auth.users encrypted_password
      const cryptCheck = await query(
        `SELECT (encrypted_password = extensions.crypt($1, encrypted_password)) AS match 
         FROM auth.users 
         WHERE id = $2`,
        [cleanPass, user.id]
      );
      if (cryptCheck.rows.length > 0 && cryptCheck.rows[0].match) {
        isMatch = true;
      }
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid security key. Access denied.',
      });
    }

    const ipAddress = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') as string;
    const userAgent = (req.headers['user-agent'] || 'Direct Client') as string;

    // 3. Record login in user_logins
    await query(
      `INSERT INTO user_logins (user_id, ip_address, user_agent)
       VALUES ($1, $2, $3)`,
      [user.id, ipAddress, userAgent]
    );

    // 4. Update last_login_at in public.users and auth.users
    const updateRes = await query(
      `UPDATE public.users 
       SET last_login_at = NOW(), updated_at = NOW() 
       WHERE id = $1 
       RETURNING last_login_at`,
      [user.id]
    );

    await query(
      `UPDATE auth.users 
       SET last_sign_in_at = NOW() 
       WHERE id = $1`,
      [user.id]
    );

    const latestLoginAt = updateRes.rows[0]?.last_login_at || new Date().toISOString();

    // 5. Record system activity
    await query(
      `INSERT INTO system_activities (type, title, meta, badge_label, badge_variant, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        'operator_login',
        `Operator session active: ${user.name}`,
        `IP: ${ipAddress.split(',')[0]} • Authenticated in Supabase Auth`,
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
      FROM public.users u
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
      JOIN public.users u ON u.id = ul.user_id
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
