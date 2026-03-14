const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');

const SQLITE_PATH = path.join(__dirname, '..', 'school.db');
const DATABASE_URL = process.env.DATABASE_URL;
const PGSSL = process.env.PGSSL === 'false' ? false : { rejectUnauthorized: false };

const TABLES = [
  { name: 'students', columns: ['id', 'admission_no', 'full_name', 'class_name', 'section', 'gender', 'dob', 'b_form_no', 'parent_name', 'phone', 'address', 'admission_date', 'created_at'] },
  { name: 'attendance', columns: ['id', 'student_id', 'attendance_date', 'status', 'remarks', 'created_at'] },
  { name: 'results', columns: ['id', 'student_id', 'exam_name', 'subject', 'max_marks', 'obtained_marks', 'grade', 'remarks', 'created_at'] },
  { name: 'fees', columns: ['id', 'student_id', 'fee_month', 'total_amount', 'paid_amount', 'due_amount', 'payment_date', 'payment_mode', 'remarks', 'created_at'] },
  { name: 'notices', columns: ['id', 'title', 'body', 'audience', 'publish_date', 'created_at'] },
  { name: 'timetable', columns: ['id', 'class_name', 'section', 'weekday', 'period_name', 'subject', 'teacher_name', 'start_time', 'end_time', 'created_at'] },
  { name: 'users', columns: ['id', 'username', 'password_hash', 'role', 'created_at'] },
];

function openSqlite(filePath) {
  return new sqlite3.Database(filePath);
}

function sqliteAll(db, sql) {
  return new Promise((resolve, reject) => {
    db.all(sql, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

async function copyTable(sqliteDb, pgClient, table) {
  const rows = await sqliteAll(sqliteDb, `SELECT ${table.columns.join(', ')} FROM ${table.name} ORDER BY id ASC`);
  if (!rows.length) {
    console.log(`Skipping ${table.name}: no rows`);
    return;
  }

  const placeholders = table.columns.map((_, index) => `$${index + 1}`).join(', ');
  const updateColumns = table.columns
    .filter((column) => column !== 'id')
    .map((column) => `${column} = EXCLUDED.${column}`)
    .join(', ');

  const sql = `
    INSERT INTO ${table.name} (${table.columns.join(', ')})
    VALUES (${placeholders})
    ON CONFLICT (id) DO UPDATE SET ${updateColumns}
  `;

  for (const row of rows) {
    const values = table.columns.map((column) => row[column]);
    await pgClient.query(sql, values);
  }

  await pgClient.query(
    `SELECT setval(pg_get_serial_sequence($1, 'id'), COALESCE((SELECT MAX(id) FROM ${table.name}), 1), true)`,
    [table.name]
  );

  console.log(`Copied ${rows.length} row(s) into ${table.name}`);
}

async function main() {
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is required. Set it to your Render PostgreSQL connection string.');
  }

  const sqliteDb = openSqlite(SQLITE_PATH);
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: PGSSL,
  });

  const pgClient = await pool.connect();

  try {
    await pgClient.query('BEGIN');
    for (const table of TABLES) {
      await copyTable(sqliteDb, pgClient, table);
    }
    await pgClient.query('COMMIT');
    console.log('SQLite to PostgreSQL migration completed successfully.');
  } catch (error) {
    await pgClient.query('ROLLBACK');
    throw error;
  } finally {
    pgClient.release();
    await pool.end();
    sqliteDb.close();
  }
}

main().catch((error) => {
  console.error('Migration failed.');
  console.error(error);
  process.exit(1);
});
