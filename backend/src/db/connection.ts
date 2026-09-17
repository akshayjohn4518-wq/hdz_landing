import pg from 'pg';
import { config } from '../config/env.js';

const { Pool } = pg;

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('[DATABASE] Unexpected error on idle client:', err.message);
});

export const query = async (text: string, params?: unknown[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (config.nodeEnv === 'development') {
    console.log(`[DB QUERY] duration=${duration}ms rows=${res.rowCount}`);
  }
  return res;
};

export const checkDbConnection = async (): Promise<{ connected: boolean; latencyMs: number; error?: string }> => {
  const start = Date.now();
  try {
    const res = await pool.query('SELECT NOW() as current_time, current_database() as database');
    const latencyMs = Date.now() - start;
    return {
      connected: true,
      latencyMs,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      latencyMs: Date.now() - start,
      error: errorMsg,
    };
  }
};
