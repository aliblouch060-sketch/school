require('./load-env');

const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const webPush = require('web-push');
const { initDb, run, get, all, isPostgres } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const JWT_EXPIRES_IN = String(process.env.JWT_EXPIRES_IN || 'never').trim();
const WHATSAPP_TOKEN = String(process.env.WHATSAPP_TOKEN || '').trim();
const WHATSAPP_PHONE_NUMBER_ID = String(process.env.WHATSAPP_PHONE_NUMBER_ID || '').trim();
const WHATSAPP_API_VERSION = String(process.env.WHATSAPP_API_VERSION || 'v20.0').trim();
const SCHOOL_NAME = String(process.env.SCHOOL_NAME || 'The Scholar Kids School').trim();
let startupPromise;
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

function ensureAppReady() {
  if (!startupPromise) {
    startupPromise = initDb()
      .then(() => ensureDefaultAdmin())
      .then(() => ensureWebPushConfigured());
  }
  return startupPromise;
}

app.use(async (_req, _res, next) => {
  try {
    await ensureAppReady();
    next();
  } catch (error) {
    next(error);
  }
});

function normalizeClassName(input) {
  if (!input) return null;
  const key = String(input).trim().toLowerCase();
  return CLASS_ALIAS[key] || null;
}

function computeGrade(obtainedMarks, maxMarks) {
  const percentage = (Number(obtainedMarks) / Number(maxMarks)) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
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

function getCurrentFeeMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function escapePowerShellSingleQuotedText(value) {
  return String(value || '').replace(/'/g, "''");
}

function normalizeWhatsAppPhone(rawPhone) {
  const digits = String(rawPhone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) {
    return `92${digits.slice(1)}`;
  }
  return digits;
}

function buildAbsenceWhatsAppMessage(row) {
  const classLabel = `${row.class_name || '-'}${row.section ? `-${row.section}` : ''}`;
  const studentName = row.full_name || 'Student';
  const dateLabel = row.attendance_date || '';
  return (
    `Dear Parent/Guardian,\n` +
    `This is to inform you that ${studentName} (Class ${classLabel}) was absent from school` +
    `${dateLabel ? ` on ${dateLabel}` : ' today'}.\n` +
    `If there is any issue, please contact the school office.\n` +
    `Regards,\n${SCHOOL_NAME}`
  );
}

async function sendWhatsAppMessage({ to, body }) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) return { ok: false, reason: 'missing-config' };
  if (!to || !body) return { ok: false, reason: 'invalid-payload' };
  if (typeof fetch !== 'function') return { ok: false, reason: 'fetch-missing' };

  const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text();
    return { ok: false, reason: 'api-error', detail };
  }

  return { ok: true };
}

async function maybeSendAbsenceWhatsApp(row) {
  if (!row || row.status !== 'Absent') return;
  const phone = normalizeWhatsAppPhone(row.phone);
  if (!phone) return;

  try {
    const message = buildAbsenceWhatsAppMessage(row);
    const result = await sendWhatsAppMessage({ to: phone, body: message });
    if (!result.ok && result.reason !== 'missing-config') {
      console.error('WhatsApp message failed:', result.reason);
    }
  } catch (error) {
    console.error('WhatsApp message failed:', error.message);
  }
}

async function getAppSetting(key, defaultValue = null) {
  const row = await get('SELECT value FROM app_settings WHERE key = ? LIMIT 1', [String(key)]);
  return row ? row.value : defaultValue;
}

async function setAppSetting(key, value) {
  const settingKey = String(key);
  const settingValue = String(value ?? '');
  if (isPostgres) {
    await all(
      `INSERT INTO app_settings (key, value, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(key)
       DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
      [settingKey, settingValue]
    );
    return;
  }

  await run(
    `INSERT INTO app_settings (key, value, updated_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(key)
     DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
    [settingKey, settingValue]
  );
}

async function ensureWebPushConfigured() {
  let publicKey = await getAppSetting('push_vapid_public_key', '');
  let privateKey = await getAppSetting('push_vapid_private_key', '');

  if (!publicKey || !privateKey) {
    const generated = webPush.generateVAPIDKeys();
    publicKey = generated.publicKey;
    privateKey = generated.privateKey;
    await setAppSetting('push_vapid_public_key', publicKey);
    await setAppSetting('push_vapid_private_key', privateKey);
  }

  webPush.setVapidDetails(
    process.env.WEB_PUSH_SUBJECT || 'mailto:admin@school.local',
    publicKey,
    privateKey
  );

  return { publicKey, privateKey };
}

async function isAbsencePopupEnabled() {
  const value = await getAppSetting('absence_notifications_enabled', '0');
  return String(value) === '1';
}

function parsePushSubscription(rawValue) {
  if (!rawValue || typeof rawValue !== 'object') return null;
  const endpoint = String(rawValue.endpoint || '').trim();
  const p256dh = String(rawValue.keys?.p256dh || '').trim();
  const auth = String(rawValue.keys?.auth || '').trim();
  if (!endpoint || !p256dh || !auth) return null;
  return {
    endpoint,
    keys: { p256dh, auth },
  };
}

async function savePushSubscription(userId, subscription) {
  const payload = JSON.stringify(subscription);
  await run(
    `INSERT INTO push_subscriptions (user_id, endpoint, subscription_json)
     VALUES (?, ?, ?)
     ON CONFLICT(endpoint)
     DO UPDATE SET user_id = excluded.user_id, subscription_json = excluded.subscription_json`,
    [userId, subscription.endpoint, payload]
  );
}

async function deletePushSubscription(endpoint) {
  await run('DELETE FROM push_subscriptions WHERE endpoint = ?', [String(endpoint || '').trim()]);
}

function sendWindowsAbsencePopup(row) {
  if (process.platform !== 'win32' || !row) return;

  const title = escapePowerShellSingleQuotedText('School Management System');
  const classLabel = `${row.class_name || '-'}${row.section ? `-${row.section}` : ''}`;
  const message = escapePowerShellSingleQuotedText(
    `${row.full_name || 'Student'} from class ${classLabel} is absent on ${row.attendance_date || ''}.`
  );
  const script = `$wshell = New-Object -ComObject Wscript.Shell; $wshell.Popup('${message}',5,'${title}',64) | Out-Null`;

  try {
    const child = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', script], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
    });
    child.unref();
  } catch (error) {
    console.error('Windows absence popup failed:', error.message);
  }
}

async function maybeSendAbsencePopup(row) {
  if (!row || row.status !== 'Absent') return;
  if (!(await isAbsencePopupEnabled())) return;
  sendWindowsAbsencePopup(row);
}

async function sendPushNotificationToAdmins(row) {
  if (!row || row.status !== 'Absent') return;

  const subscriptions = await all(
    `SELECT ps.id, ps.endpoint, ps.subscription_json
     FROM push_subscriptions ps
     JOIN users u ON u.id = ps.user_id
     WHERE u.role = 'Admin'`
  );

  if (!subscriptions.length) return;

  const { publicKey } = await ensureWebPushConfigured();
  const classLabel = `${row.class_name || '-'}${row.section ? `-${row.section}` : ''}`;
  const payload = JSON.stringify({
    title: 'Student Absent Alert',
    body: `${row.full_name || 'Student'} from class ${classLabel} is absent.`,
    url: '/#attendance',
    tag: `absence-${row.id}`,
    attendanceId: row.id,
    studentName: row.full_name || 'Student',
    className: classLabel,
    attendanceDate: row.attendance_date || '',
    publicKey,
  });

  await Promise.all(
    subscriptions.map(async (entry) => {
      try {
        const subscription = JSON.parse(entry.subscription_json);
        await webPush.sendNotification(subscription, payload);
      } catch (error) {
        const statusCode = Number(error?.statusCode || 0);
        if (statusCode === 404 || statusCode === 410) {
          await deletePushSubscription(entry.endpoint);
          return;
        }
        console.error('Push notification failed:', error.message);
      }
    })
  );
}

function feeMonthFromPaymentDate(paymentDate) {
  const raw = String(paymentDate || '').trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return '';
  return `${match[1]}-${match[2]}`;
}

function isValidDateInput(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || '').trim());
}

function normalizeMonthInput(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^\d{4}-\d{2}$/.test(raw)) return raw;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw.slice(0, 7);
  return '';
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
    `SELECT id, class_name, parent_name, phone, admission_date, fee_discount
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
  const rawTotal = calculateSiblingAdjustedFee(baseFee, siblingCount, siblingPosition);
  const discount = Math.max(Number(student.fee_discount || 0), 0);
  const totalAmount = Math.max(rawTotal - discount, 0);

  return {
    totalAmount,
    rawTotal,
    discount,
    baseFee,
    siblingCount,
    siblingPosition,
    className: student.class_name,
  };
}

async function autoGenerateFeesForMonth({ feeMonth, className = null, paymentDate = null, paymentMode = null, remarks = null }) {
  const normalizedMonth = normalizeFeeMonthInput(feeMonth);
  if (!normalizedMonth) {
    throw new Error('feeMonth must be YYYY-MM');
  }

  const normalizedClass = className ? normalizeClassName(className) : null;
  if (className && !normalizedClass) {
    throw new Error(`className must be one of: ${ALLOWED_CLASSES.join(', ')}`);
  }

  const students = normalizedClass
    ? await all('SELECT id, admission_date FROM students WHERE class_name = ? ORDER BY admission_date ASC, id ASC', [normalizedClass])
    : await all('SELECT id, admission_date FROM students ORDER BY class_name ASC, admission_date ASC, id ASC');

  let createdCount = 0;
  let skippedCount = 0;

  for (const student of students) {
    const admissionMonth = feeMonthFromPaymentDate(student.admission_date || '');
    if (admissionMonth && admissionMonth > normalizedMonth) {
      skippedCount += 1;
      continue;
    }

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

  return {
    feeMonth: normalizedMonth,
    className: normalizedClass || 'All',
    createdCount,
    skippedCount,
    totalStudents: students.length,
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

app.get('/api/dashboard', requireAuth, async (req, res) => {
  try {
    const students = await get('SELECT COUNT(*) AS count FROM students');
    const today = new Date().toISOString().slice(0, 10);
    const present = await get(
      "SELECT COUNT(*) AS count FROM attendance WHERE attendance_date = ? AND status = 'Present'",
      [today]
    );
    const dues = req.user?.role === 'Admin'
      ? await get('SELECT COALESCE(SUM(due_amount), 0) AS total_due FROM fees')
      : { total_due: 0 };
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
  const { fullName, className, section, gender, dob, parentName, phone, address, admissionDate, feeDiscount } = req.body;
  const bFormNo = req.body.bFormNo || req.body.b_form_no || req.body.bformNo || null;

  if (!fullName || !className || !admissionDate) {
    return res.status(400).json({ error: 'fullName, className, admissionDate are required' });
  }

  const normalizedClass = normalizeClassName(className);
  if (!normalizedClass) {
    return res.status(400).json({ error: `className must be one of: ${ALLOWED_CLASSES.join(', ')}` });
  }

  const parsedDiscount = feeDiscount == null || feeDiscount === '' ? 0 : Number(feeDiscount);
  if (Number.isNaN(parsedDiscount) || parsedDiscount < 0) {
    return res.status(400).json({ error: 'feeDiscount must be a valid positive number' });
  }

  const admissionNo = buildAdmissionNo();

  try {
    const result = await run(
      `INSERT INTO students
      (admission_no, full_name, class_name, section, gender, dob, b_form_no, parent_name, phone, address, admission_date, fee_discount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        parsedDiscount,
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
      `SELECT a.*, s.full_name, s.class_name, s.admission_no, s.phone, s.parent_name, s.section
       FROM attendance a
       JOIN students s ON s.id = a.student_id
       WHERE a.student_id = ? AND a.attendance_date = ?`,
      [studentId, attendanceDate]
    );

    await maybeSendAbsencePopup(row);
    await sendPushNotificationToAdmins(row);
    await maybeSendAbsenceWhatsApp(row);

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
      SELECT a.*, s.full_name, s.class_name, s.admission_no, s.phone, s.parent_name, s.section
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

  const grade = computeGrade(obtainedMarks, maxMarks);

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
  const { studentId, feeMonth, paidAmount, paymentDate, paymentMode, remarks, totalAmount } = req.body;

  if (!studentId || !feeMonth) {
    return res.status(400).json({ error: 'studentId and feeMonth are required' });
  }

  const parsedPaidAmount = paidAmount == null || paidAmount === '' ? 0 : Number(paidAmount);
  if (Number.isNaN(parsedPaidAmount) || parsedPaidAmount < 0) {
    return res.status(400).json({ error: 'paidAmount must be a valid positive number' });
  }

  const parsedTotalAmount = totalAmount == null || totalAmount === '' ? null : Number(totalAmount);
  if (parsedTotalAmount != null && (Number.isNaN(parsedTotalAmount) || parsedTotalAmount < 0)) {
    return res.status(400).json({ error: 'totalAmount must be a valid positive number' });
  }

  try {
    const normalizedMonth = normalizeFeeMonthInput(feeMonth, paymentDate);
    if (!normalizedMonth) {
      return res.status(400).json({ error: 'feeMonth must be YYYY-MM (or provide paymentDate)' });
    }
    const existing = await get('SELECT id FROM fees WHERE student_id = ? AND fee_month = ? LIMIT 1', [studentId, normalizedMonth]);

    const feeInfo = await computeAutoFeeForStudent(Number(studentId));
    const finalTotalAmount = parsedTotalAmount != null ? parsedTotalAmount : feeInfo.totalAmount;
    const dueAmount = Math.max(finalTotalAmount - parsedPaidAmount, 0);

    if (parsedTotalAmount != null) {
      const derivedDiscount = Math.max(Number(feeInfo.rawTotal || 0) - finalTotalAmount, 0);
      await run('UPDATE students SET fee_discount = ? WHERE id = ?', [derivedDiscount, studentId]);
    }

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
          finalTotalAmount,
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
        finalTotalAmount,
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

  try {
    const summary = await autoGenerateFeesForMonth({ feeMonth, className, paymentDate, paymentMode, remarks });
    return res.json(summary);
  } catch (error) {
    if (error.message.includes('className must be one of')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message.includes('feeMonth must be YYYY-MM')) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/fees', requireAuth, requireRole('Admin'), async (req, res) => {
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

app.get('/api/fees/defaulters', requireAuth, requireRole('Admin'), async (req, res) => {
  try {
    const normalizedClass = normalizeClassName(req.query.className);
    const feeMonthInput = String(req.query.feeMonth || '').trim();
    const feeMonth = feeMonthInput ? normalizeFeeMonthInput(feeMonthInput, null) : '';

    if (req.query.className && !normalizedClass) {
      return res.status(400).json({ error: `className must be one of: ${ALLOWED_CLASSES.join(', ')}` });
    }

    if (feeMonthInput && !feeMonth) {
      return res.status(400).json({ error: 'feeMonth must be YYYY-MM' });
    }

    if (feeMonth) {
    }

    let sql = `
      SELECT
        s.id AS student_id,
        s.full_name,
        s.admission_no,
        s.class_name,
        s.section,
        s.phone,
        s.parent_name,
        SUM(f.due_amount) AS total_due,
        MAX(f.fee_month) AS last_fee_month`;
    const params = [];

    if (feeMonth) {
      sql += `,
        SUM(CASE WHEN f.fee_month = ? AND f.due_amount > 0 THEN 1 ELSE 0 END)`;
      params.push(feeMonth);
    }

    sql += `
      FROM fees f
      JOIN students s ON s.id = f.student_id
      WHERE f.due_amount > 0`;

    if (normalizedClass) {
      sql += ' AND s.class_name = ?';
      params.push(normalizedClass);
    }

    sql += `
      GROUP BY s.id, s.full_name, s.admission_no, s.class_name, s.section, s.phone, s.parent_name`;

    if (feeMonth) {
      sql += ' HAVING SUM(CASE WHEN f.fee_month = ? AND f.due_amount > 0 THEN 1 ELSE 0 END) > 0';
      params.push(feeMonth);
    }

    sql += ' ORDER BY total_due DESC, s.full_name ASC';

    const rows = await all(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/fees/paid', requireAuth, requireRole('Admin'), async (req, res) => {
  try {
    const normalizedClass = normalizeClassName(req.query.className);
    const feeMonthInput = String(req.query.feeMonth || '').trim();
    const feeMonth = feeMonthInput ? normalizeFeeMonthInput(feeMonthInput, null) : '';

    if (req.query.className && !normalizedClass) {
      return res.status(400).json({ error: `className must be one of: ${ALLOWED_CLASSES.join(', ')}` });
    }

    if (feeMonthInput && !feeMonth) {
      return res.status(400).json({ error: 'feeMonth must be YYYY-MM' });
    }

    if (feeMonth) {
    }

    let sql = `
      SELECT f.*, s.full_name, s.admission_no, s.class_name, s.section
      FROM fees f
      JOIN students s ON s.id = f.student_id
      WHERE f.paid_amount > 0`;
    const params = [];

    if (normalizedClass) {
      sql += ' AND s.class_name = ?';
      params.push(normalizedClass);
    }

    if (feeMonth) {
      sql += ' AND f.fee_month = ?';
      params.push(feeMonth);
    }

    sql += ' ORDER BY f.payment_date DESC, f.created_at DESC';

    const rows = await all(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/fees/summary', requireAuth, requireRole('Admin'), async (req, res) => {
  try {
    const normalizedClass = normalizeClassName(req.query.className);
    const feeMonthInput = String(req.query.feeMonth || '').trim();
    const feeMonth = feeMonthInput ? normalizeFeeMonthInput(feeMonthInput, null) : '';

    if (req.query.className && !normalizedClass) {
      return res.status(400).json({ error: `className must be one of: ${ALLOWED_CLASSES.join(', ')}` });
    }

    if (feeMonthInput && !feeMonth) {
      return res.status(400).json({ error: 'feeMonth must be YYYY-MM' });
    }

    if (feeMonth) {
    }

    let paidSql = `
      SELECT
        COALESCE(SUM(f.paid_amount), 0) AS total_paid,
        COALESCE(SUM(CASE WHEN f.paid_amount > 0 THEN 1 ELSE 0 END), 0) AS paid_count
      FROM fees f
      JOIN students s ON s.id = f.student_id
      WHERE 1=1`;
    const paidParams = [];

    if (normalizedClass) {
      paidSql += ' AND s.class_name = ?';
      paidParams.push(normalizedClass);
    }

    if (feeMonth) {
      paidSql += ' AND f.fee_month = ?';
      paidParams.push(feeMonth);
    }

    let dueSql = `
      SELECT
        COALESCE(SUM(f.due_amount), 0) AS total_due
      FROM fees f
      JOIN students s ON s.id = f.student_id
      WHERE 1=1`;
    const dueParams = [];

    if (normalizedClass) {
      dueSql += ' AND s.class_name = ?';
      dueParams.push(normalizedClass);
    }

    if (feeMonth) {
      dueSql += ' AND f.fee_month = ?';
      dueParams.push(feeMonth);
    }

    let defaulterSql = `
      SELECT
        COUNT(DISTINCT s.id) AS defaulter_count
      FROM fees f
      JOIN students s ON s.id = f.student_id
      WHERE f.due_amount > 0`;
    const defaulterParams = [];

    if (normalizedClass) {
      defaulterSql += ' AND s.class_name = ?';
      defaulterParams.push(normalizedClass);
    }

    if (feeMonth) {
      defaulterSql += ' AND f.fee_month = ?';
      defaulterParams.push(feeMonth);
    }

    const [paidRow, dueRow, defaulterRow] = await Promise.all([
      get(paidSql, paidParams),
      get(dueSql, dueParams),
      get(defaulterSql, defaulterParams),
    ]);

    return res.json({
      totalPaid: Number(paidRow?.total_paid || 0),
      paidCount: Number(paidRow?.paid_count || 0),
      totalDue: Number(dueRow?.total_due || 0),
      defaulterCount: Number(defaulterRow?.defaulter_count || 0),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/expenses', requireAuth, requireRole('Admin'), async (req, res) => {
  const { expenseDate, category, amount, paymentMode, remarks } = req.body || {};
  const normalizedDate = String(expenseDate || '').trim();
  const normalizedCategory = String(category || '').trim();
  const numericAmount = Number(amount);

  if (!isValidDateInput(normalizedDate)) {
    return res.status(400).json({ error: 'expenseDate must be YYYY-MM-DD' });
  }
  if (!normalizedCategory) {
    return res.status(400).json({ error: 'category is required' });
  }
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }

  try {
    const result = await run(
      `INSERT INTO expenses (expense_date, category, amount, payment_mode, remarks)
       VALUES (?, ?, ?, ?, ?)`,
      [normalizedDate, normalizedCategory, numericAmount, paymentMode || null, remarks || null]
    );
    const row = await get('SELECT * FROM expenses WHERE id = ?', [result.id]);
    return res.status(201).json(row);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/expenses/bulk', requireAuth, requireRole('Admin'), async (req, res) => {
  const rows = Array.isArray(req.body?.rows) ? req.body.rows : [];
  if (!rows.length) return res.status(400).json({ error: 'rows are required' });

  const invalid = rows.find((row) =>
    !isValidDateInput(row?.expenseDate) ||
    !String(row?.category || '').trim() ||
    !Number.isFinite(Number(row?.amount)) ||
    Number(row?.amount) <= 0
  );
  if (invalid) {
    return res.status(400).json({ error: 'Each row needs expenseDate, category, amount' });
  }

  try {
    for (const row of rows) {
      await run(
        `INSERT INTO expenses (expense_date, category, amount, payment_mode, remarks)
         VALUES (?, ?, ?, ?, ?)`,
        [
          String(row.expenseDate).trim(),
          String(row.category).trim(),
          Number(row.amount),
          row.paymentMode ? String(row.paymentMode).trim() : null,
          row.remarks ? String(row.remarks).trim() : null,
        ]
      );
    }
    return res.json({ saved: rows.length });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/expenses', requireAuth, requireRole('Admin'), async (req, res) => {
  try {
    const from = String(req.query.from || '').trim();
    const to = String(req.query.to || '').trim();
    const month = normalizeMonthInput(req.query.month);

    if ((from && !isValidDateInput(from)) || (to && !isValidDateInput(to))) {
      return res.status(400).json({ error: 'from/to must be YYYY-MM-DD' });
    }
    if (req.query.month && !month) {
      return res.status(400).json({ error: 'month must be YYYY-MM' });
    }

    let sql = 'SELECT * FROM expenses';
    const params = [];

    if (from && to) {
      sql += ' WHERE expense_date BETWEEN ? AND ?';
      params.push(from, to);
    } else if (from) {
      sql += ' WHERE expense_date >= ?';
      params.push(from);
    } else if (to) {
      sql += ' WHERE expense_date <= ?';
      params.push(to);
    } else if (month) {
      sql += ' WHERE expense_date LIKE ?';
      params.push(`${month}%`);
    }

    sql += ' ORDER BY expense_date DESC, id DESC LIMIT 200';

    const rows = await all(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/expenses/summary', requireAuth, requireRole('Admin'), async (req, res) => {
  try {
    const month = normalizeMonthInput(req.query.month) || getCurrentFeeMonthKey();
    if (req.query.month && !month) {
      return res.status(400).json({ error: 'month must be YYYY-MM' });
    }

    const expenseRow = await get(
      `SELECT COALESCE(SUM(amount), 0) AS total_expense,
              COUNT(*) AS expense_count
       FROM expenses
       WHERE expense_date LIKE ?`,
      [`${month}%`]
    );

    const incomeRow = await get(
      `SELECT COALESCE(SUM(paid_amount), 0) AS total_income,
              COUNT(*) AS income_count
       FROM fees
       WHERE paid_amount > 0
         AND (payment_date LIKE ? OR (payment_date IS NULL AND fee_month = ?))`,
      [`${month}%`, month]
    );

    const allExpenseRow = await get(
      `SELECT COALESCE(SUM(amount), 0) AS total_expense
       FROM expenses`
    );

    const allIncomeRow = await get(
      `SELECT COALESCE(SUM(paid_amount), 0) AS total_income
       FROM fees
       WHERE paid_amount > 0`
    );

    return res.json({
      month,
      totalIncome: Number(incomeRow?.total_income || 0),
      totalExpense: Number(expenseRow?.total_expense || 0),
      incomeCount: Number(incomeRow?.income_count || 0),
      expenseCount: Number(expenseRow?.expense_count || 0),
      netTotal: Number(incomeRow?.total_income || 0) - Number(expenseRow?.total_expense || 0),
      allTimeIncome: Number(allIncomeRow?.total_income || 0),
      allTimeExpense: Number(allExpenseRow?.total_expense || 0),
      allTimeNet: Number(allIncomeRow?.total_income || 0) - Number(allExpenseRow?.total_expense || 0),
    });
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

  const { fullName, className, section, gender, dob, parentName, phone, address, admissionDate, feeDiscount } = req.body;
  const bFormNo = req.body.bFormNo || req.body.b_form_no || req.body.bformNo || null;

  if (!fullName || !className || !admissionDate) {
    return res.status(400).json({ error: 'fullName, className, admissionDate are required' });
  }

  const normalizedClass = normalizeClassName(className);
  if (!normalizedClass) {
    return res.status(400).json({ error: `className must be one of: ${ALLOWED_CLASSES.join(', ')}` });
  }

  const parsedDiscount = feeDiscount == null || feeDiscount === '' ? 0 : Number(feeDiscount);
  if (Number.isNaN(parsedDiscount) || parsedDiscount < 0) {
    return res.status(400).json({ error: 'feeDiscount must be a valid positive number' });
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
           admission_date = ?,
           fee_discount = ?
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
        parsedDiscount,
        studentId,
      ]
    );

    const row = await get('SELECT * FROM students WHERE id = ?', [studentId]);
    return res.json(row);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/results/bulk', requireAuth, requireRole('Admin', 'Teacher'), async (req, res) => {
  try {
    const studentId = Number(req.body?.studentId);
    const examName = String(req.body?.examName || '').trim();
    const entries = Array.isArray(req.body?.entries) ? req.body.entries : [];

    if (!studentId || !examName || !entries.length) {
      return res.status(400).json({ error: 'studentId, examName and entries are required' });
    }

    const savedIds = [];

    for (const entry of entries) {
      const subject = String(entry?.subject || '').trim();
      const maxMarks = Number(entry?.maxMarks);
      const obtainedMarks = Number(entry?.obtainedMarks);
      const remarks = entry?.remarks == null ? null : String(entry.remarks).trim() || null;

      if (!subject || Number.isNaN(maxMarks) || Number.isNaN(obtainedMarks)) {
        return res.status(400).json({ error: 'Each result entry needs subject, maxMarks and obtainedMarks' });
      }

      const grade = computeGrade(obtainedMarks, maxMarks);
      await run('DELETE FROM results WHERE student_id = ? AND exam_name = ? AND subject = ?', [studentId, examName, subject]);
      const result = await run(
        `INSERT INTO results
         (student_id, exam_name, subject, max_marks, obtained_marks, grade, remarks)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [studentId, examName, subject, maxMarks, obtainedMarks, grade, remarks]
      );
      savedIds.push(result.id);
    }

    const placeholders = savedIds.map(() => '?').join(', ');
    const rows = await all(
      `SELECT r.*, s.full_name, s.admission_no, s.class_name, s.section
       FROM results r
       JOIN students s ON s.id = r.student_id
       WHERE r.id IN (${placeholders})
       ORDER BY r.subject ASC`,
      savedIds
    );

    return res.status(201).json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/result-subjects', requireAuth, async (req, res) => {
  try {
    const normalizedClass = normalizeClassName(req.query.className);
    if (!normalizedClass) {
      return res.status(400).json({ error: `className must be one of: ${ALLOWED_CLASSES.join(', ')}` });
    }

    const rows = await all(
      `SELECT id, class_name, subject_name, max_marks, sort_order
       FROM result_subject_templates
       WHERE class_name = ?
       ORDER BY sort_order ASC, subject_name ASC`,
      [normalizedClass]
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/result-subjects', requireAuth, requireRole('Admin', 'Teacher'), async (req, res) => {
  try {
    const normalizedClass = normalizeClassName(req.body?.className);
    const subjects = Array.isArray(req.body?.subjects) ? req.body.subjects : [];

    if (!normalizedClass) {
      return res.status(400).json({ error: `className must be one of: ${ALLOWED_CLASSES.join(', ')}` });
    }

    const cleanedSubjects = subjects
      .map((item, index) => ({
        subjectName: String(item?.subjectName || '').trim(),
        maxMarks: Number(item?.maxMarks ?? 100),
        sortOrder: Number.isInteger(Number(item?.sortOrder)) ? Number(item.sortOrder) : index,
      }))
      .filter((item) => item.subjectName);

    if (!cleanedSubjects.length) {
      return res.status(400).json({ error: 'At least one subject is required' });
    }

    for (const item of cleanedSubjects) {
      if (Number.isNaN(item.maxMarks) || item.maxMarks <= 0) {
        return res.status(400).json({ error: 'Each subject maxMarks must be a positive number' });
      }
    }

    await run('DELETE FROM result_subject_templates WHERE class_name = ?', [normalizedClass]);

    for (const item of cleanedSubjects) {
      await run(
        `INSERT INTO result_subject_templates (class_name, subject_name, max_marks, sort_order)
         VALUES (?, ?, ?, ?)`,
        [normalizedClass, item.subjectName, item.maxMarks, item.sortOrder]
      );
    }

    const rows = await all(
      `SELECT id, class_name, subject_name, max_marks, sort_order
       FROM result_subject_templates
       WHERE class_name = ?
       ORDER BY sort_order ASC, subject_name ASC`,
      [normalizedClass]
    );

    return res.status(201).json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/syllabus-templates', requireAuth, async (req, res) => {
  try {
    const normalizedClass = normalizeClassName(req.query.className);
    const termName = String(req.query.termName || '').trim();
    if (!normalizedClass || !termName) {
      return res.status(400).json({ error: 'className and termName are required' });
    }

    const rows = await all(
      `SELECT id, class_name, term_name, subject_name, details, sort_order
       FROM syllabus_templates
       WHERE class_name = ? AND term_name = ?
       ORDER BY sort_order ASC, subject_name ASC`,
      [normalizedClass, termName]
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/syllabus-templates', requireAuth, requireRole('Admin', 'Teacher'), async (req, res) => {
  try {
    const normalizedClass = normalizeClassName(req.body?.className);
    const termName = String(req.body?.termName || '').trim();
    const subjects = Array.isArray(req.body?.subjects) ? req.body.subjects : [];

    if (!normalizedClass || !termName) {
      return res.status(400).json({ error: 'className and termName are required' });
    }

    const cleanedSubjects = subjects
      .map((item, index) => ({
        subjectName: String(item?.subjectName || '').trim(),
        details: item?.details == null ? '' : String(item.details).trim(),
        sortOrder: Number.isInteger(Number(item?.sortOrder)) ? Number(item.sortOrder) : index,
      }))
      .filter((item) => item.subjectName);

    if (!cleanedSubjects.length) {
      return res.status(400).json({ error: 'At least one subject is required' });
    }

    await run('DELETE FROM syllabus_templates WHERE class_name = ? AND term_name = ?', [normalizedClass, termName]);

    for (const item of cleanedSubjects) {
      await run(
        `INSERT INTO syllabus_templates (class_name, term_name, subject_name, details, sort_order)
         VALUES (?, ?, ?, ?, ?)`,
        [normalizedClass, termName, item.subjectName, item.details || null, item.sortOrder]
      );
    }

    const rows = await all(
      `SELECT id, class_name, term_name, subject_name, details, sort_order
       FROM syllabus_templates
       WHERE class_name = ? AND term_name = ?
       ORDER BY sort_order ASC, subject_name ASC`,
      [normalizedClass, termName]
    );
    return res.status(201).json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

  app.get('/api/syllabus', requireAuth, async (req, res) => {
    try {
      const studentId = Number(req.query.studentId);
      const termName = String(req.query.termName || '').trim();

    if (!studentId || !termName) {
      return res.status(400).json({ error: 'studentId and termName are required' });
    }

    const student = await get('SELECT * FROM students WHERE id = ?', [studentId]);
    if (!student) return res.status(404).json({ error: 'Student not found' });

      const [rows, resultSubjects] = await Promise.all([
        all(
          `SELECT subject_name, details, sort_order
           FROM syllabus_templates
           WHERE class_name = ? AND term_name = ?
           ORDER BY sort_order ASC, subject_name ASC`,
          [student.class_name, termName]
        ),
        all(
          `SELECT subject_name, sort_order
           FROM result_subject_templates
           WHERE class_name = ?
           ORDER BY sort_order ASC, subject_name ASC`,
          [student.class_name]
        ),
      ]);

      const detailsBySubject = new Map(
        rows.map((item) => [String(item.subject_name || '').toLowerCase(), item.details || ''])
      );
      let subjects = [];
      if (Array.isArray(resultSubjects) && resultSubjects.length) {
        subjects = resultSubjects.map((item, index) => ({
          subject_name: item.subject_name,
          details: detailsBySubject.get(String(item.subject_name || '').toLowerCase()) || '',
          sort_order: Number.isInteger(Number(item.sort_order)) ? Number(item.sort_order) : index,
        }));
      } else {
        subjects = rows;
      }

      return res.json({
        student,
        termName,
        className: student.class_name,
        subjects,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

app.get('/api/settings/absence-notifications', requireAuth, requireRole('Admin'), async (_req, res) => {
  try {
    return res.json({ enabled: await isAbsencePopupEnabled() });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/settings/absence-notifications', requireAuth, requireRole('Admin'), async (req, res) => {
  try {
    const enabled = Boolean(req.body?.enabled);
    await setAppSetting('absence_notifications_enabled', enabled ? '1' : '0');
    return res.json({ enabled });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/push/vapid-public-key', requireAuth, requireRole('Admin'), async (_req, res) => {
  try {
    const { publicKey } = await ensureWebPushConfigured();
    return res.json({ publicKey });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/push/subscribe', requireAuth, requireRole('Admin'), async (req, res) => {
  try {
    const subscription = parsePushSubscription(req.body?.subscription);
    if (!subscription) {
      return res.status(400).json({ error: 'Valid push subscription is required' });
    }

    await savePushSubscription(req.user.id, subscription);
    return res.status(201).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/push/unsubscribe', requireAuth, requireRole('Admin'), async (req, res) => {
  try {
    const endpoint = String(req.body?.endpoint || '').trim();
    if (!endpoint) {
      return res.status(400).json({ error: 'Subscription endpoint is required' });
    }

    await deletePushSubscription(endpoint);
    return res.json({ ok: true });
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
      `SELECT a.*, s.full_name, s.class_name, s.admission_no, s.phone, s.parent_name, s.section
       FROM attendance a
       JOIN students s ON s.id = a.student_id
       WHERE a.id = ?`,
      [attendanceId]
    );

    await maybeSendAbsencePopup(row);
    await sendPushNotificationToAdmins(row);
    await maybeSendAbsenceWhatsApp(row);

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

  const grade = computeGrade(parsedObtainedMarks, parsedMaxMarks);

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

  const { studentId, feeMonth, paidAmount, paymentDate, paymentMode, remarks, totalAmount } = req.body;
  const parsedStudentId = Number(studentId);

  if (!parsedStudentId || !feeMonth) {
    return res.status(400).json({ error: 'studentId and feeMonth are required' });
  }

  const parsedPaidAmount = paidAmount == null || paidAmount === '' ? 0 : Number(paidAmount);
  if (Number.isNaN(parsedPaidAmount) || parsedPaidAmount < 0) {
    return res.status(400).json({ error: 'paidAmount must be a valid positive number' });
  }

  const parsedTotalAmount = totalAmount == null || totalAmount === '' ? null : Number(totalAmount);
  if (parsedTotalAmount != null && (Number.isNaN(parsedTotalAmount) || parsedTotalAmount < 0)) {
    return res.status(400).json({ error: 'totalAmount must be a valid positive number' });
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
    const finalTotalAmount = parsedTotalAmount != null ? parsedTotalAmount : feeInfo.totalAmount;
    const dueAmount = Math.max(finalTotalAmount - parsedPaidAmount, 0);

    if (parsedTotalAmount != null) {
      const derivedDiscount = Math.max(Number(feeInfo.rawTotal || 0) - finalTotalAmount, 0);
      await run('UPDATE students SET fee_discount = ? WHERE id = ?', [derivedDiscount, parsedStudentId]);
    }

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
        finalTotalAmount,
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

if (require.main === module) {
  ensureAppReady()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}

module.exports = app;









