import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  console.log('[MIGRATION] Starting database migration process...');
  const client = await pool.connect();

  try {
    // 1. Ensure migrations tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Fetch already executed migrations
    const executedRes = await client.query('SELECT name FROM _migrations ORDER BY id ASC');
    const executedMigrations = new Set(executedRes.rows.map((r: { name: string }) => r.name));

    // 3. Read migration files
    const localDir = path.join(__dirname, 'migrations');
    const srcDir = path.join(__dirname, '..', '..', 'src', 'db', 'migrations');
    const migrationsDir = fs.existsSync(localDir) ? localDir : srcDir;

    if (!fs.existsSync(migrationsDir)) {
      console.log('[MIGRATION] No migrations directory found at:', migrationsDir);
      return;
    }

    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    console.log(`[MIGRATION] Found ${migrationFiles.length} migration file(s).`);

    let appliedCount = 0;
    for (const file of migrationFiles) {
      if (executedMigrations.has(file)) {
        console.log(`[MIGRATION] Skipping already executed: ${file}`);
        continue;
      }

      console.log(`[MIGRATION] Executing migration: ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`[MIGRATION] Successfully executed: ${file}`);
        appliedCount++;
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`[MIGRATION] Error executing ${file}:`, err);
        throw err;
      }
    }

    console.log(`[MIGRATION] Migration complete. Applied ${appliedCount} new migration(s).`);
  } catch (err) {
    console.error('[MIGRATION] Migration failed:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

// If invoked directly via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations().then(() => {
    process.exit(process.exitCode || 0);
  });
}
