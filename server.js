const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initDb, run, get, all, isPostgres } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const JWT_EXPIRES_IN = String(process.env.JWT_EXPIRES_IN || 'never').trim();
const JWT_SIGN_OPTIONS = (() => {
  const keyword = JWT_EXPIRES_IN.toLowerCase();
  if (!JWT_EXPIRES_IN || ['never', 'none', 'lifetime', 'infinite', 'no-expiry'].includes(keyword)) {
    return {};
  }
  return { expiresIn: JWT_EXPIRES_IN };
})();

const ALLOWED_CLASSES = [
  'Play Group',
  'Nursery',
  'Prep',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
];

const CLASS_ALIAS = {
  'play group': 'Play Group',
  playgroup: 'Play Group',
  'play-group': 'Play Group',
  nursery: 'Nursery',
  prep: 'Prep',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
};

const BASE_FEE_BY_CLASS = {
  'Play Group': 2000,
  Nursery: 2000,
  Prep: 2000,
  '1': 2000,
  '2': 2000,
  '3': 2000,
  '4': 2000,
  '5': 2000,
  '6': 2500,
  '7': 2500,
  '8': 2500,
  '9': 3000,
  '10': 3000,
};

app.use(express.json({ limit: '2mb' }));
app.use((req, res, next) => {
  const noStorePaths = new Set(['/', '/index.html', '/app.js', '/styles.css', '/service-worker.js', '/manifest.webmanifest']);
  if (noStorePaths.has(req.path)) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
  }
  next();
});
app.use(
  express.static(path.join(__dirname, 'public'), {
    etag: false,
    lastModified: false,
    setHeaders(res, filePath) {
      const assetName = path.basename(filePath);
      if (['index.html', 'app.js', 'styles.css', 'service-worker.js', 'manifest.webmanifest'].includes(assetName)) {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.set('Surrogate-Control', 'no-store');
      }
    },
  })
);

function normalizeClassName(input) {
  if (!input) return null;
  const key = String(input).trim().toLowerCase();
  return CLASS_ALIAS[key] || null;
}

function buildAdmissionNo() {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `ADM-${year}-${random}`;
}

function normalizeFamilyValue(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function getBaseFeeForClass(className) {
  return BASE_FEE_BY_CLASS[className] || 0;
}

function feeMonthToLabel(value) {
  return String(value || '').trim();
}

function feeMonthFromPaymentDate(paymentDate) {
  const raw = String(paymentDate || '').trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return '';
  return `${match[1]}-${match[2]}`;
}

function resolveFeeMonthLabel(feeMonth, paymentDate) {
  const explicit = feeMonthToLabel(feeMonth);
  if (explicit) return explicit;
  return feeMonthFromPaymentDate(paymentDate);
}

function normalizeFeeMonthInput(feeMonth, paymentDate) {
  const raw = resolveFeeMonthLabel(feeMonth, paymentDate);
  if (!raw) return '';
  if (/^\d{4}-\d{2}$/.test(raw)) return raw;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw.slice(0, 7);
  return '';
}

async function getSiblingGroupForStudent(student) {
  const parentKey = normalizeFamilyValue(student.parent_name);
  const phoneKey = normalizeFamilyValue(student.phone);

  if (parentKey) {
    return all(
      `SELECT id, class_name, admission_date, created_at
       FROM students
       WHERE LOWER(TRIM(COALESCE(parent_name, ''))) = ?
       ORDER BY admission_date ASC, id ASC`,
      [parentKey]
    );
  }

  if (phoneKey) {
    return all(
      `SELECT id, class_name, admission_date, created_at
       FROM students
       WHERE LOWER(TRIM(COALESCE(phone, ''))) = ?
       ORDER BY admission_date ASC, id ASC`,
      [phoneKey]
    );
  }

  return [student];
}

function calculateSiblingAdjustedFee(baseFee, siblingCount, siblingPosition) {
  if (siblingCount <= 2) return baseFee;

  if (siblingCount === 3) {
    return siblingPosition === 3 ? baseFee / 2 : baseFee;
  }

  return siblingPosition >= 4 ? 0 : baseFee;
}

async function computeAutoFeeForStudent(studentId) {
  const student = await get(
    `SELECT id, class_name, parent_name, phone, admission_date
     FROM students
     WHERE id = ?`,
    [studentId]
  );

  if (!student) {
    throw new Error('Student not found');
  }

  const siblings = await getSiblingGroupForStudent(student);
  const ordered = siblings
    .slice()
    .sort((a, b) => {
      const dateA = String(a.admission_date || '');
      const dateB = String(b.admission_date || '');
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      return Number(a.id) - Number(b.id);
    });

  const siblingCount = ordered.length;
  const siblingPosition = ordered.findIndex((item) => Number(item.id) === Number(student.id)) + 1 || 1;
  const baseFee = getBaseFeeForClass(student.class_name);
  const totalAmount = calculateSiblingAdjustedFee(baseFee, siblingCount, siblingPosition);

  return {
    totalAmount,
    baseFee,
    siblingCount,
    siblingPosition,
    className: student.class_name,
  };
}

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, JWT_SIGN_OPTIONS);
}

function safeUser(user) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    created_at: user.created_at,
  };
}

async function ensureDefaultAdmin() {
  const adminExists = await get("SELECT id FROM users WHERE role = 'Admin' LIMIT 1");
  if (adminExists) return;

  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  await run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [username, passwordHash, 'Admin']);

  console.log('Default admin user created.');
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);
  console.log('Please change this password after first login.');
}

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await get('SELECT id, username, role, created_at FROM users WHERE id = ?', [payload.id]);

    if (!user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    req.user = user;
    return next();
  } catch (_error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    return next();
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'School management API running', database: isPostgres ? 'postgres' : 'sqlite' });
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }

    const user = await get('SELECT * FROM users WHERE username = ?', [String(username).trim()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(String(password), user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken(user);
    return res.json({ token, user: safeUser(user) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  // Rotate token on each profile check so active users stay signed in.
  const token = signToken(req.user);
  return res.json({ user: safeUser(req.user), token });
});

app.get('/api/auth/users', requireAuth, requireRole('Admin'), async (_req, res) => {
  try {
    const users = await all('SELECT id, username, role, created_at FROM users ORDER BY created_at DESC');
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/users', requireAuth, requireRole('Admin'), async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ error: 'username, password and role are required' });
    }

    if (!['Admin', 'Teacher'].includes(role)) {
      return res.status(400).json({ error: 'role must be Admin or Teacher' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ error: 'password must be at least 6 characters' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const result = await run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [
      String(username).trim(),
      passwordHash,
      role,
    ]);

    const user = await get('SELECT id, username, role, created_at FROM users WHERE id = ?', [result.id]);
    return res.status(201).json(user);
  } catch (error) {
    if (String(error.message).toLowerCase().includes('unique')) {
      return res.status(400).json({ error: 'username already exists' });
    }
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard', requireAuth, async (_req, res) => {
  try {
    const students = await get('SELECT COUNT(*) AS count FROM students');
    const today = new Date().toISOString().slice(0, 10);
    const present = await get(
      "SELECT COUNT(*) AS count FROM attendance WHERE attendance_date = ? AND status = 'Present'",
      [today]
    );
    const dues = await get('SELECT COALESCE(SUM(due_amount), 0) AS total_due FROM fees');
    const results = await get('SELECT COUNT(*) AS count FROM results');
    const notices = await get('SELECT COUNT(*) AS count FROM notices');
    const timetableEntries = await get('SELECT COUNT(*) AS count FROM timetable');

    res.json({
      students: students?.count || 0,
      todayPresent: present?.count || 0,
      totalFeeDue: dues?.total_due || 0,
      resultEntries: results?.count || 0,
      notices: notices?.count || 0,
      timetableEntries: timetableEntries?.count || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admissions', requireAuth, requireRole('Admin'), async (req, res) => {
  const { fullName, className, section, gender, dob, parentName, phone, address, admissionDate } = req.body;
  const bFormNo = req.body.bFormNo || req.body.b_form_no || req.body.bformNo || null;

  if (!fullName || !className || !admissionDate) {
    return res.status(400).json({ error: 'fullName, className, admissionDate are required' });
  }

  const normalizedClass = normalizeClassName(className);
  if (!normalizedClass) {
    return res.status(400).json({ error: `className must be one of: ${ALLOWED_CLASSES.join(', ')}` });
  }

  const admissionNo = buildAdmissionNo();

  try {
    const result = await run(
      `INSERT INTO students
      (admission_no, full_name, class_name, section, gender, dob, b_form_no, parent_name, phone, address, admission_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        admissionNo,
        fullName,
        normalizedClass,
        section || null,
        gender || null,
        dob || null,
        bFormNo,
        parentName || null,
        phone || null,
        address || null,
        admissionDate,
      ]
    );

    const row = await get('SELECT * FROM students WHERE id = ?', [result.id]);
    return res.status(201).json(row);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/students', requireAuth, async (req, res) => {
  try {
    const normalizedClass = normalizeClassName(req.query.className);

    const rows = normalizedClass
      ? await all('SELECT * FROM students WHERE class_name = ? ORDER BY full_name', [normalizedClass])
      : await all('SELECT * FROM students ORDER BY full_name');

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/attendance', requireAuth, requireRole('Admin', 'Teacher'), async (req, res) => {
  const { studentId, attendanceDate, status, remarks } = req.body;

  if (!studentId || !attendanceDate || !status) {
    return res.status(400).json({ error: 'studentId, attendanceDate and status are required' });
  }

  try {
    await run(
      `INSERT INTO attendance (student_id, attendance_date, status, remarks)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(student_id, attendance_date)
       DO UPDATE SET status=excluded.status, remarks=excluded.remarks`,
      [studentId, attendanceDate, status, remarks || null]
    );

    const row = await get(
      `SELECT a.*, s.full_name, s.class_name, s.admission_no
       FROM attendance a
       JOIN students s ON s.id = a.student_id
       WHERE a.student_id = ? AND a.attendance_date = ?`,
      [studentId, attendanceDate]
    );

    return res.status(201).json(row);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/attendance', requireAuth, async (req, res) => {
  try {
    const { attendanceDate } = req.query;
    const normalizedClass = normalizeClassName(req.query.className);
    const date = attendanceDate || new Date().toISOString().slice(0, 10);

    let sql = `
      SELECT a.*, s.full_name, s.class_name, s.admission_no
      FROM attendance a
      JOIN students s ON s.id = a.student_id
      WHERE a.attendance_date = ?`;
    const params = [date];

    if (normalizedClass) {
      sql += ' AND s.class_name = ?';
      params.push(normalizedClass);
    }

    sql += ' ORDER BY s.full_name';

    const rows = await all(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/results', requireAuth, requireRole('Admin', 'Teacher'), async (req, res) => {
  const { studentId, examName, subject, maxMarks, obtainedMarks, remarks } = req.body;

  if (!studentId || !examName || !subject || maxMarks == null || obtainedMarks == null) {
    return res.status(400).json({
      error: 'studentId, examName, subject, maxMarks and obtainedMarks are required',
    });
  }

  const percentage = (Number(obtainedMarks) / Number(maxMarks)) * 100;
  let grade = 'F';
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B';
  else if (percentage >= 60) grade = 'C';
  else if (percentage >= 50) grade = 'D';

  try {
    const result = await run(
      `INSERT INTO results
      (student_id, exam_name, subject, max_marks, obtained_marks, grade, remarks)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [studentId, examName, subject, maxMarks, obtainedMarks, grade, remarks || null]
    );

    const row = await get(
      `SELECT r.*, s.full_name, s.admission_no
       FROM results r
       JOIN students s ON s.id = r.student_id
       WHERE r.id = ?`,
      [result.id]
    );

    return res.status(201).json(row);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/results', requireAuth, async (req, res) => {
  try {
    const { studentId, examName } = req.query;
    const normalizedClass = normalizeClassName(req.query.className);

    if (req.query.className && !normalizedClass) {
      return res.status(400).json({ error: `className must be one of: ${ALLOWED_CLASSES.join(', ')}` });
    }

    if (!studentId && !normalizedClass) {
      return res.status(400).json({ error: 'studentId or className is required' });
    }

    let sql = `
      SELECT r.*, s.full_name, s.admission_no, s.class_name, s.section
      FROM results r
      JOIN students s ON s.id = r.student_id
      WHERE 1=1`;
    const params = [];

    if (studentId) {
      sql += ' AND r.student_id = ?';
      params.push(studentId);
    }

    if (normalizedClass) {
      sql += ' AND s.class_name = ?';
      params.push(normalizedClass);
    }

    if (examName) {
      sql += ' AND LOWER(r.exam_name) LIKE ?';
      params.push(`%${String(examName).trim().toLowerCase()}%`);
    }

    sql += ' ORDER BY s.class_name, s.full_name, r.created_at DESC';

    const rows = await all(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/fees/calculate', requireAuth, requireRole('Admin'), async (req, res) => {
  try {
    const { studentId } = req.query;
    if (!studentId) return res.status(400).json({ error: 'studentId is required' });

    const fee = await computeAutoFeeForStudent(Number(studentId));
    return res.json(fee);
  } catch (error) {
    if (error.message === 'Student not found') return res.status(404).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/fees', requireAuth, requireRole('Admin'), async (req, res) => {
  const { studentId, feeMonth, paidAmount, paymentDate, paymentMode, remarks } = req.body;

  if (!studentId || !feeMonth) {
    return res.status(400).json({ error: 'studentId and feeMonth are required' });
  }

  const parsedPaidAmount = paidAmount == null || paidAmount === '' ? 0 : Number(paidAmount);
  if (Number.isNaN(parsedPaidAmount) || parsedPaidAmount < 0) {
    return res.status(400).json({ error: 'paidAmount must be a valid positive number' });
  }

  try {
    const normalizedMonth = normalizeFeeMonthInput(feeMonth, paymentDate);
    if (!normalizedMonth) {
      return res.status(400).json({ error: 'feeMonth must be YYYY-MM (or provide paymentDate)' });
    }
    const existing = await get('SELECT id FROM fees WHERE student_id = ? AND fee_month = ? LIMIT 1', [studentId, normalizedMonth]);

    const feeInfo = await computeAutoFeeForStudent(Number(studentId));
    const totalAmount = feeInfo.totalAmount;
    const dueAmount = totalAmount - parsedPaidAmount;

    if (existing) {
      await run(
        `UPDATE fees
         SET total_amount = ?,
             paid_amount = ?,
             due_amount = ?,
             payment_date = ?,
             payment_mode = ?,
             remarks = ?
         WHERE id = ?`,
        [
          totalAmount,
          parsedPaidAmount,
          dueAmount,
          paymentDate || null,
          paymentMode || null,
          remarks || null,
          existing.id,
        ]
      );

      const row = await get(
        `SELECT f.*, s.full_name, s.admission_no, s.class_name, s.section
         FROM fees f
         JOIN students s ON s.id = f.student_id
         WHERE f.id = ?`,
        [existing.id]
      );

      return res.json({ ...row, updated: true });
    }

    const result = await run(
      `INSERT INTO fees
      (student_id, fee_month, total_amount, paid_amount, due_amount, payment_date, payment_mode, remarks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        studentId,
        normalizedMonth,
        totalAmount,
        parsedPaidAmount,
        dueAmount,
        paymentDate || null,
        paymentMode || null,
        remarks || null,
      ]
    );

    const row = await get(
      `SELECT f.*, s.full_name, s.admission_no, s.class_name, s.section
       FROM fees f
       JOIN students s ON s.id = f.student_id
       WHERE f.id = ?`,
      [result.id]
    );

    return res.status(201).json(row);
  } catch (error) {
    if (error.message === 'Student not found') return res.status(404).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/fees/auto-generate', requireAuth, requireRole('Admin'), async (req, res) => {
  const { feeMonth, className, paymentDate, paymentMode, remarks } = req.body || {};
  if (!feeMonth) return res.status(400).json({ error: 'feeMonth is required' });

  const normalizedMonth = normalizeFeeMonthInput(feeMonth);
  const normalizedClass = className ? normalizeClassName(className) : null;

  if (className && !normalizedClass) {
    return res.status(400).json({ error: `className must be one of: ${ALLOWED_CLASSES.join(', ')}` });
  }

  try {
    const students = normalizedClass
      ? await all('SELECT id FROM students WHERE class_name = ? ORDER BY admission_date ASC, id ASC', [normalizedClass])
      : await all('SELECT id FROM students ORDER BY class_name ASC, admission_date ASC, id ASC');

    let createdCount = 0;
    let skippedCount = 0;

    for (const student of students) {
      const existing = await get('SELECT id FROM fees WHERE student_id = ? AND fee_month = ? LIMIT 1', [
        student.id,
        normalizedMonth,
      ]);

      if (existing) {
        skippedCount += 1;
        continue;
      }

      const feeInfo = await computeAutoFeeForStudent(Number(student.id));
      const totalAmount = feeInfo.totalAmount;

      await run(
        `INSERT INTO fees
        (student_id, fee_month, total_amount, paid_amount, due_amount, payment_date, payment_mode, remarks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [student.id, normalizedMonth, totalAmount, 0, totalAmount, paymentDate || null, paymentMode || null, remarks || null]
      );

      createdCount += 1;
    }

    return res.json({
      feeMonth: normalizedMonth,
      className: normalizedClass || 'All',
      createdCount,
      skippedCount,
      totalStudents: students.length,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/fees', requireAuth, async (req, res) => {
  try {
    const { studentId } = req.query;
    const normalizedClass = normalizeClassName(req.query.className);
    let sql = `
      SELECT f.*, s.full_name, s.admission_no, s.class_name, s.section
      FROM fees f
      JOIN students s ON s.id = f.student_id`;
    const params = [];

    if (studentId && normalizedClass) {
      sql += ' WHERE f.student_id = ? AND s.class_name = ?';
      params.push(studentId, normalizedClass);
    } else if (studentId) {
      sql += ' WHERE f.student_id = ?';
      params.push(studentId);
    } else if (normalizedClass) {
      sql += ' WHERE s.class_name = ?';
      params.push(normalizedClass);
    }

    sql += ' ORDER BY f.created_at DESC';

    const rows = await all(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/notices', requireAuth, requireRole('Admin'), async (req, res) => {
  const { title, body, audience, publishDate } = req.body;

  if (!title || !body || !audience || !publishDate) {
    return res.status(400).json({ error: 'title, body, audience and publishDate are required' });
  }

  try {
    const result = await run(
      `INSERT INTO notices (title, body, audience, publish_date)
       VALUES (?, ?, ?, ?)`,
      [title, body, audience, publishDate]
    );

    const row = await get('SELECT * FROM notices WHERE id = ?', [result.id]);
    return res.status(201).json(row);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/notices', requireAuth, async (_req, res) => {
  try {
    const rows = await all('SELECT * FROM notices ORDER BY publish_date DESC, created_at DESC');
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/timetable', requireAuth, requireRole('Admin'), async (req, res) => {
  const { className, section, weekday, periodName, subject, teacherName, startTime, endTime } = req.body;

  if (!className || !weekday || !periodName || !subject) {
    return res.status(400).json({
      error: 'className, weekday, periodName and subject are required',
    });
  }

  const normalizedClass = normalizeClassName(className);
  if (!normalizedClass) {
    return res.status(400).json({ error: `className must be one of: ${ALLOWED_CLASSES.join(', ')}` });
  }

  try {
    const result = await run(
      `INSERT INTO timetable
      (class_name, section, weekday, period_name, subject, teacher_name, start_time, end_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        normalizedClass,
        section || null,
        weekday,
        periodName,
        subject,
        teacherName || null,
        startTime || null,
        endTime || null,
      ]
    );

    const row = await get('SELECT * FROM timetable WHERE id = ?', [result.id]);
    return res.status(201).json(row);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/timetable', requireAuth, async (req, res) => {
  try {
    const normalizedClass = normalizeClassName(req.query.className);
    let sql = 'SELECT * FROM timetable';
    const params = [];

    if (normalizedClass) {
      sql += ' WHERE class_name = ?';
      params.push(normalizedClass);
    }

    sql += ' ORDER BY weekday, start_time, period_name';

    const rows = await all(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});



app.put('/api/students/:id', requireAuth, requireRole('Admin'), async (req, res) => {
  const studentId = Number(req.params.id);
  if (!studentId) return res.status(400).json({ error: 'Invalid student id' });

  const { fullName, className, section, gender, dob, parentName, phone, address, admissionDate } = req.body;
  const bFormNo = req.body.bFormNo || req.body.b_form_no || req.body.bformNo || null;

  if (!fullName || !className || !admissionDate) {
    return res.status(400).json({ error: 'fullName, className, admissionDate are required' });
  }

  const normalizedClass = normalizeClassName(className);
  if (!normalizedClass) {
    return res.status(400).json({ error: `className must be one of: ${ALLOWED_CLASSES.join(', ')}` });
  }

  try {
    const existing = await get('SELECT id FROM students WHERE id = ?', [studentId]);
    if (!existing) return res.status(404).json({ error: 'Student not found' });

    await run(
      `UPDATE students
       SET full_name = ?,
           class_name = ?,
           section = ?,
           gender = ?,
           dob = ?,
           b_form_no = ?,
           parent_name = ?,
           phone = ?,
           address = ?,
           admission_date = ?
       WHERE id = ?`,
      [
        fullName,
        normalizedClass,
        section || null,
        gender || null,
        dob || null,
        bFormNo,
        parentName || null,
        phone || null,
        address || null,
        admissionDate,
        studentId,
      ]
    );

    const row = await get('SELECT * FROM students WHERE id = ?', [studentId]);
    return res.json(row);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/attendance/:id', requireAuth, requireRole('Admin', 'Teacher'), async (req, res) => {
  const attendanceId = Number(req.params.id);
  if (!attendanceId) return res.status(400).json({ error: 'Invalid attendance id' });

  const { studentId, attendanceDate, status, remarks } = req.body;
  const parsedStudentId = Number(studentId);

  if (!parsedStudentId || !attendanceDate || !status) {
    return res.status(400).json({ error: 'studentId, attendanceDate and status are required' });
  }

  try {
    const existing = await get('SELECT id FROM attendance WHERE id = ?', [attendanceId]);
    if (!existing) return res.status(404).json({ error: 'Attendance record not found' });

    await run(
      `UPDATE attendance
       SET student_id = ?,
           attendance_date = ?,
           status = ?,
           remarks = ?
       WHERE id = ?`,
      [parsedStudentId, attendanceDate, status, remarks || null, attendanceId]
    );

    const row = await get(
      `SELECT a.*, s.full_name, s.class_name, s.admission_no
       FROM attendance a
       JOIN students s ON s.id = a.student_id
       WHERE a.id = ?`,
      [attendanceId]
    );

    return res.json(row);
  } catch (error) {
    if (String(error.message).toLowerCase().includes('unique')) {
      return res.status(400).json({ error: 'Attendance for this student and date already exists' });
    }
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/results/:id', requireAuth, requireRole('Admin', 'Teacher'), async (req, res) => {
  const resultId = Number(req.params.id);
  if (!resultId) return res.status(400).json({ error: 'Invalid result id' });

  const { studentId, examName, subject, maxMarks, obtainedMarks, remarks } = req.body;
  const parsedStudentId = Number(studentId);
  const parsedMaxMarks = Number(maxMarks);
  const parsedObtainedMarks = Number(obtainedMarks);

  if (!parsedStudentId || !examName || !subject || Number.isNaN(parsedMaxMarks) || Number.isNaN(parsedObtainedMarks)) {
    return res.status(400).json({
      error: 'studentId, examName, subject, maxMarks and obtainedMarks are required',
    });
  }

  const percentage = (parsedObtainedMarks / parsedMaxMarks) * 100;
  let grade = 'F';
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B';
  else if (percentage >= 60) grade = 'C';
  else if (percentage >= 50) grade = 'D';

  try {
    const existing = await get('SELECT id FROM results WHERE id = ?', [resultId]);
    if (!existing) return res.status(404).json({ error: 'Result not found' });

    await run(
      `UPDATE results
       SET student_id = ?,
           exam_name = ?,
           subject = ?,
           max_marks = ?,
           obtained_marks = ?,
           grade = ?,
           remarks = ?
       WHERE id = ?`,
      [parsedStudentId, examName, subject, parsedMaxMarks, parsedObtainedMarks, grade, remarks || null, resultId]
    );

    const row = await get(
      `SELECT r.*, s.full_name, s.admission_no, s.class_name, s.section
       FROM results r
       JOIN students s ON s.id = r.student_id
       WHERE r.id = ?`,
      [resultId]
    );

    return res.json(row);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/fees/:id', requireAuth, requireRole('Admin'), async (req, res) => {
  const feeId = Number(req.params.id);
  if (!feeId) return res.status(400).json({ error: 'Invalid fee id' });

  const { studentId, feeMonth, paidAmount, paymentDate, paymentMode, remarks } = req.body;
  const parsedStudentId = Number(studentId);

  if (!parsedStudentId || !feeMonth) {
    return res.status(400).json({ error: 'studentId and feeMonth are required' });
  }

  const parsedPaidAmount = paidAmount == null || paidAmount === '' ? 0 : Number(paidAmount);
  if (Number.isNaN(parsedPaidAmount) || parsedPaidAmount < 0) {
    return res.status(400).json({ error: 'paidAmount must be a valid positive number' });
  }

  try {
    const normalizedMonth = normalizeFeeMonthInput(feeMonth, paymentDate);
    if (!normalizedMonth) {
      return res.status(400).json({ error: 'feeMonth must be YYYY-MM (or provide paymentDate)' });
    }

    const existing = await get('SELECT id FROM fees WHERE id = ?', [feeId]);
    if (!existing) return res.status(404).json({ error: 'Fee record not found' });

    const duplicate = await get(
      'SELECT id FROM fees WHERE student_id = ? AND fee_month = ? AND id != ? LIMIT 1',
      [parsedStudentId, normalizedMonth, feeId]
    );
    if (duplicate) {
      return res.status(400).json({ error: 'Fee record for this student and month already exists' });
    }

    const feeInfo = await computeAutoFeeForStudent(parsedStudentId);
    const totalAmount = feeInfo.totalAmount;
    const dueAmount = totalAmount - parsedPaidAmount;

    await run(
      `UPDATE fees
       SET student_id = ?,
           fee_month = ?,
           total_amount = ?,
           paid_amount = ?,
           due_amount = ?,
           payment_date = ?,
           payment_mode = ?,
           remarks = ?
       WHERE id = ?`,
      [
        parsedStudentId,
        normalizedMonth,
        totalAmount,
        parsedPaidAmount,
        dueAmount,
        paymentDate || null,
        paymentMode || null,
        remarks || null,
        feeId,
      ]
    );

    const row = await get(
      `SELECT f.*, s.full_name, s.admission_no, s.class_name, s.section
       FROM fees f
       JOIN students s ON s.id = f.student_id
       WHERE f.id = ?`,
      [feeId]
    );

    return res.json(row);
  } catch (error) {
    if (error.message === 'Student not found') return res.status(404).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/notices/:id', requireAuth, requireRole('Admin'), async (req, res) => {
  const noticeId = Number(req.params.id);
  if (!noticeId) return res.status(400).json({ error: 'Invalid notice id' });

  const { title, body, audience, publishDate } = req.body;

  if (!title || !body || !audience || !publishDate) {
    return res.status(400).json({ error: 'title, body, audience and publishDate are required' });
  }

  try {
    const existing = await get('SELECT id FROM notices WHERE id = ?', [noticeId]);
    if (!existing) return res.status(404).json({ error: 'Notice not found' });

    await run(
      `UPDATE notices
       SET title = ?,
           body = ?,
           audience = ?,
           publish_date = ?
       WHERE id = ?`,
      [title, body, audience, publishDate, noticeId]
    );

    const row = await get('SELECT * FROM notices WHERE id = ?', [noticeId]);
    return res.json(row);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/timetable/:id', requireAuth, requireRole('Admin'), async (req, res) => {
  const timetableId = Number(req.params.id);
  if (!timetableId) return res.status(400).json({ error: 'Invalid timetable id' });

  const { className, section, weekday, periodName, subject, teacherName, startTime, endTime } = req.body;

  if (!className || !weekday || !periodName || !subject) {
    return res.status(400).json({
      error: 'className, weekday, periodName and subject are required',
    });
  }

  const normalizedClass = normalizeClassName(className);
  if (!normalizedClass) {
    return res.status(400).json({ error: `className must be one of: ${ALLOWED_CLASSES.join(', ')}` });
  }

  try {
    const existing = await get('SELECT id FROM timetable WHERE id = ?', [timetableId]);
    if (!existing) return res.status(404).json({ error: 'Timetable entry not found' });

    await run(
      `UPDATE timetable
       SET class_name = ?,
           section = ?,
           weekday = ?,
           period_name = ?,
           subject = ?,
           teacher_name = ?,
           start_time = ?,
           end_time = ?
       WHERE id = ?`,
      [
        normalizedClass,
        section || null,
        weekday,
        periodName,
        subject,
        teacherName || null,
        startTime || null,
        endTime || null,
        timetableId,
      ]
    );

    const row = await get('SELECT * FROM timetable WHERE id = ?', [timetableId]);
    return res.json(row);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
app.delete('/api/students/:id', requireAuth, requireRole('Admin'), async (req, res) => {
  try {
    const studentId = Number(req.params.id);
    if (!studentId) return res.status(400).json({ error: 'Invalid student id' });

    const existing = await get('SELECT id FROM students WHERE id = ?', [studentId]);
    if (!existing) return res.status(404).json({ error: 'Student not found' });

    await run('DELETE FROM attendance WHERE student_id = ?', [studentId]);
    await run('DELETE FROM results WHERE student_id = ?', [studentId]);
    await run('DELETE FROM fees WHERE student_id = ?', [studentId]);
    const result = await run('DELETE FROM students WHERE id = ?', [studentId]);

    return res.json({ ok: true, deleted: result.changes || 0 });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/api/attendance/:id', requireAuth, requireRole('Admin'), async (req, res) => {
  try {
    const attendanceId = Number(req.params.id);
    if (!attendanceId) return res.status(400).json({ error: 'Invalid attendance id' });

    const existing = await get('SELECT id FROM attendance WHERE id = ?', [attendanceId]);
    if (!existing) return res.status(404).json({ error: 'Attendance record not found' });

    const result = await run('DELETE FROM attendance WHERE id = ?', [attendanceId]);
    return res.json({ ok: true, deleted: result.changes || 0 });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/api/results/:id', requireAuth, requireRole('Admin'), async (req, res) => {
  try {
    const resultId = Number(req.params.id);
    if (!resultId) return res.status(400).json({ error: 'Invalid result id' });

    const existing = await get('SELECT id FROM results WHERE id = ?', [resultId]);
    if (!existing) return res.status(404).json({ error: 'Result not found' });

    const result = await run('DELETE FROM results WHERE id = ?', [resultId]);
    return res.json({ ok: true, deleted: result.changes || 0 });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/api/fees/:id', requireAuth, requireRole('Admin'), async (req, res) => {
  try {
    const feeId = Number(req.params.id);
    if (!feeId) return res.status(400).json({ error: 'Invalid fee id' });

    const existing = await get('SELECT id FROM fees WHERE id = ?', [feeId]);
    if (!existing) return res.status(404).json({ error: 'Fee record not found' });

    const result = await run('DELETE FROM fees WHERE id = ?', [feeId]);
    return res.json({ ok: true, deleted: result.changes || 0 });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/api/notices/:id', requireAuth, requireRole('Admin'), async (req, res) => {
  try {
    const noticeId = Number(req.params.id);
    if (!noticeId) return res.status(400).json({ error: 'Invalid notice id' });

    const existing = await get('SELECT id FROM notices WHERE id = ?', [noticeId]);
    if (!existing) return res.status(404).json({ error: 'Notice not found' });

    const result = await run('DELETE FROM notices WHERE id = ?', [noticeId]);
    return res.json({ ok: true, deleted: result.changes || 0 });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/api/timetable/:id', requireAuth, requireRole('Admin'), async (req, res) => {
  try {
    const timetableId = Number(req.params.id);
    if (!timetableId) return res.status(400).json({ error: 'Invalid timetable id' });

    const existing = await get('SELECT id FROM timetable WHERE id = ?', [timetableId]);
    if (!existing) return res.status(404).json({ error: 'Timetable entry not found' });

    const result = await run('DELETE FROM timetable WHERE id = ?', [timetableId]);
    return res.json({ ok: true, deleted: result.changes || 0 });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected server error' });
});

initDb()
  .then(async () => {
    await ensureDefaultAdmin();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });









