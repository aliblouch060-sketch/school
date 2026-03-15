const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');

const dbPath = process.env.VERCEL && !process.env.DATABASE_URL
  ? '/tmp/school.db'
  : path.join(__dirname, 'school.db');
const isPostgres = Boolean(process.env.DATABASE_URL);

let sqliteDb;
let pgPool;

if (isPostgres) {
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.PGSSL === 'false' ? false : { rejectUnauthorized: false },
  });
} else {
  sqliteDb = new sqlite3.Database(dbPath);
}

function prepareSql(sql, params) {
  if (!isPostgres) {
    return { sql, params };
  }

  let index = 0;
  const convertedSql = sql.replace(/\?/g, () => `$${++index}`);
  return { sql: convertedSql, params };
}

function run(sql, params = []) {
  if (!isPostgres) {
    return new Promise((resolve, reject) => {
      sqliteDb.run(sql, params, function onRun(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  return (async () => {
    const { sql: convertedSql, params: convertedParams } = prepareSql(sql, params);
    const isInsert = /^\s*INSERT\s+/i.test(convertedSql);
    const hasReturning = /\bRETURNING\b/i.test(convertedSql);
    const executableSql = isInsert && !hasReturning ? `${convertedSql} RETURNING id` : convertedSql;
    const result = await pgPool.query(executableSql, convertedParams);
    return {
      id: result.rows[0] ? result.rows[0].id : null,
      changes: result.rowCount || 0,
    };
  })();
}

function get(sql, params = []) {
  if (!isPostgres) {
    return new Promise((resolve, reject) => {
      sqliteDb.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  return (async () => {
    const { sql: convertedSql, params: convertedParams } = prepareSql(sql, params);
    const result = await pgPool.query(convertedSql, convertedParams);
    return result.rows[0];
  })();
}

function all(sql, params = []) {
  if (!isPostgres) {
    return new Promise((resolve, reject) => {
      sqliteDb.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  return (async () => {
    const { sql: convertedSql, params: convertedParams } = prepareSql(sql, params);
    const result = await pgPool.query(convertedSql, convertedParams);
    return result.rows;
  })();
}

async function ensureColumn(tableName, columnName, definition) {
  if (isPostgres) {
    const exists = await get(
      `SELECT 1
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = ? AND column_name = ?`,
      [tableName, columnName]
    );

    if (!exists) {
      await run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
    }

    return;
  }

  const columns = await all(`PRAGMA table_info(${tableName})`);
  const exists = columns.some((column) => column.name === columnName);
  if (!exists) {
    await run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

async function initSqlite() {
  await run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admission_no TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      class_name TEXT NOT NULL,
      section TEXT,
      gender TEXT,
      dob TEXT,
      b_form_no TEXT,
      parent_name TEXT,
      phone TEXT,
      address TEXT,
      admission_date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      attendance_date TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('Present', 'Absent', 'Late')),
      remarks TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(student_id, attendance_date),
      FOREIGN KEY(student_id) REFERENCES students(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      exam_name TEXT NOT NULL,
      subject TEXT NOT NULL,
      max_marks INTEGER NOT NULL,
      obtained_marks REAL NOT NULL,
      grade TEXT,
      remarks TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES students(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS fees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      fee_month TEXT NOT NULL,
      total_amount REAL NOT NULL,
      paid_amount REAL NOT NULL,
      due_amount REAL NOT NULL,
      payment_date TEXT,
      payment_mode TEXT,
      remarks TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES students(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      audience TEXT NOT NULL CHECK(audience IN ('All', 'Students', 'Teachers', 'Parents')),
      publish_date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS timetable (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_name TEXT NOT NULL,
      section TEXT,
      weekday TEXT NOT NULL CHECK(weekday IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
      period_name TEXT NOT NULL,
      subject TEXT NOT NULL,
      teacher_name TEXT,
      start_time TEXT,
      end_time TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('Admin', 'Teacher')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function initPostgres() {
  await run(`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      admission_no TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      class_name TEXT NOT NULL,
      section TEXT,
      gender TEXT,
      dob TEXT,
      b_form_no TEXT,
      parent_name TEXT,
      phone TEXT,
      address TEXT,
      admission_date TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS attendance (
      id SERIAL PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id),
      attendance_date TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('Present', 'Absent', 'Late')),
      remarks TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(student_id, attendance_date)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS results (
      id SERIAL PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id),
      exam_name TEXT NOT NULL,
      subject TEXT NOT NULL,
      max_marks INTEGER NOT NULL,
      obtained_marks DOUBLE PRECISION NOT NULL,
      grade TEXT,
      remarks TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS fees (
      id SERIAL PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id),
      fee_month TEXT NOT NULL,
      total_amount DOUBLE PRECISION NOT NULL,
      paid_amount DOUBLE PRECISION NOT NULL,
      due_amount DOUBLE PRECISION NOT NULL,
      payment_date TEXT,
      payment_mode TEXT,
      remarks TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS notices (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      audience TEXT NOT NULL CHECK(audience IN ('All', 'Students', 'Teachers', 'Parents')),
      publish_date TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS timetable (
      id SERIAL PRIMARY KEY,
      class_name TEXT NOT NULL,
      section TEXT,
      weekday TEXT NOT NULL CHECK(weekday IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
      period_name TEXT NOT NULL,
      subject TEXT NOT NULL,
      teacher_name TEXT,
      start_time TEXT,
      end_time TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('Admin', 'Teacher')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function initDb() {
  if (isPostgres) {
    await initPostgres();
  } else {
    await initSqlite();
  }

  await ensureColumn('students', 'b_form_no', 'TEXT');
}

module.exports = {
  db: sqliteDb,
  run,
  get,
  all,
  initDb,
  isPostgres,
};
