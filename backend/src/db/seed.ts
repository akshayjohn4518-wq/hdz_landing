import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runSeed() {
  console.log('[SEED] Starting database seeding process...');
  const client = await pool.connect();

  try {
    const localFile = path.join(__dirname, 'migrations', '002_seed_initial_data.sql');
    const srcFile = path.join(__dirname, '..', '..', 'src', 'db', 'migrations', '002_seed_initial_data.sql');
    const seedFile = fs.existsSync(localFile) ? localFile : srcFile;
    if (!fs.existsSync(seedFile)) {
      console.error('[SEED] Seed file not found at:', seedFile);
      return;
    }

    const sql = fs.readFileSync(seedFile, 'utf-8');
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('[SEED] Database seeding completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[SEED] Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSeed().then(() => {
    process.exit(process.exitCode || 0);
  });
}
