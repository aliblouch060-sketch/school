const CLASS_OPTIONS = ['Play Group', 'Nursery', 'Prep', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const loginForm = document.getElementById('loginForm');
const userForm = document.getElementById('userForm');
const logoutBtn = document.getElementById('logoutBtn');
const currentUserInput = document.getElementById('currentUser');
const authModeInput = document.getElementById('authMode');

const admissionForm = document.getElementById('admissionForm');
const attendanceForm = document.getElementById('attendanceForm');
const resultForm = document.getElementById('resultForm');
const feeForm = document.getElementById('feeForm');
const noticeForm = document.getElementById('noticeForm');
const timetableForm = document.getElementById('timetableForm');
const voucherForm = document.getElementById('voucherForm');
const saveVoucherBtn = document.getElementById('saveVoucherBtn');
const printVoucherBtn = document.getElementById('printVoucherBtn');
const installAppBtn = document.getElementById('installAppBtn');
const classColumns = document.getElementById('classColumns');

const attendanceClass = document.getElementById('attendanceClass');
const resultClass = document.getElementById('resultClass');
const feeClass = document.getElementById('feeClass');

const attendanceStudent = document.getElementById('attendanceStudent');
const resultStudent = document.getElementById('resultStudent');
const feeStudent = document.getElementById('feeStudent');
const voucherClass = document.getElementById('voucherClass');
const voucherStudent = document.getElementById('voucherStudent');

const studentClassFilter = document.getElementById('studentClassFilter');
const studentSearchInput = document.getElementById('studentSearch');
const feeClassFilter = document.getElementById('feeClassFilter');
const attendanceClassFilter = document.getElementById('attendanceClassFilter');
const attendanceDateFilter = document.getElementById('attendanceDateFilter');
const loadAttendanceBtn = document.getElementById('loadAttendanceBtn');
const resultClassFilter = document.getElementById('resultClassFilter');
const resultExamFilter = document.getElementById('resultExamFilter');
const loadResultBtn = document.getElementById('loadResultBtn');
const feeTotalAmountInput = document.getElementById('feeTotalAmount');
const autoGenerateFeeBtn = document.getElementById('autoGenerateFeeBtn');

const extractFromPhotoBtn = document.getElementById('extractFromPhotoBtn');
const bFormPhotoInput = document.getElementById('bFormPhoto');

const studentsTableBody = document.querySelector('#studentsTable tbody');
const feesTableBody = document.querySelector('#feesTable tbody');
const noticesTableBody = document.querySelector('#noticesTable tbody');
const timetableTableBody = document.querySelector('#timetableTable tbody');
const attendanceTableBody = document.querySelector('#attendanceTable tbody');
const resultsTableBody = document.querySelector('#resultsTable tbody');
const voucherPreview = document.getElementById('voucherPreview');

const cancelAdmissionEditBtn = document.getElementById('cancelAdmissionEditBtn');
const cancelAttendanceEditBtn = document.getElementById('cancelAttendanceEditBtn');
const cancelResultEditBtn = document.getElementById('cancelResultEditBtn');
const cancelFeeEditBtn = document.getElementById('cancelFeeEditBtn');
const cancelNoticeEditBtn = document.getElementById('cancelNoticeEditBtn');
const cancelTimetableEditBtn = document.getElementById('cancelTimetableEditBtn');
const portalPages = Array.from(document.querySelectorAll('[data-portal-page]'));
const portalPageButtons = Array.from(document.querySelectorAll('[data-portal-page-btn]'));
const publicNoticeList = document.getElementById('publicNoticeList');
const publicNoticeTickerTrack = document.getElementById('publicNoticeTickerTrack');

let allStudents = [];
let allFees = [];
let authToken = localStorage.getItem('sms_token') || '';
let authUser = null;
let currentVoucher = null;
let deferredInstallPrompt = null;
let selectedWorkspaceClass = '';
let tesseractLoadPromise = null;
let tokenRefreshTimer = null;
let activePortalPage = 'home';
let serviceWorkerReloadScheduled = false;
const hadServiceWorkerControllerAtLoad = 'serviceWorker' in navigator && Boolean(navigator.serviceWorker.controller);
const TOKEN_REFRESH_INTERVAL_MS = 6 * 60 * 60 * 1000;

function setMessage(id, message, type = 'success') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className = `msg ${type}`;
}

function getFormData(form) {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
}

function feeMonthFromPaymentDate(paymentDate) {
  const raw = String(paymentDate || '').trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return '';
  return `${match[1]}-${match[2]}`;
}

function resolveFeeMonth(feeMonth, paymentDate) {
  const explicit = String(feeMonth || '').trim();
  if (explicit) return explicit;
  return feeMonthFromPaymentDate(paymentDate);
}

function resolvePortalPage(name) {
  const value = String(name || '').trim().toLowerCase();
  const pageExists = portalPages.some((page) => page.dataset.portalPage === value);
  return pageExists ? value : 'home';
}

function setPortalPage(name) {
  const targetPage = resolvePortalPage(name);
  activePortalPage = targetPage;

  portalPages.forEach((page) => {
    page.classList.toggle('is-active', page.dataset.portalPage === targetPage);
  });

  portalPageButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.portalPageBtn === targetPage);
  });
}

function syncPortalPageWithHash() {
  const hash = String(window.location.hash || '').trim();
  if (!hash.startsWith('#') || hash.length <= 1) return;

  const targetId = hash.slice(1);
  const targetElement = document.getElementById(targetId);
  if (!targetElement) return;

  const inPortalWorkspace = targetElement.closest('[data-portal-page="portal"]');
  if (inPortalWorkspace) {
    setPortalPage('portal');
  }
}

function setupPortalPages() {
  portalPageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setPortalPage(button.dataset.portalPageBtn);
    });
  });

  document.querySelectorAll('.side-nav a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      setPortalPage('portal');
    });
  });

  syncPortalPageWithHash();
  window.addEventListener('hashchange', syncPortalPageWithHash);
}

function renderPublicNoticeWidgets(notices) {
  const records = Array.isArray(notices) ? notices.slice(0, 8) : [];

  if (publicNoticeList) {
    if (!records.length) {
      publicNoticeList.innerHTML = '<li>No public notices available yet.</li>';
    } else {
      publicNoticeList.innerHTML = records
        .map((notice) => `<li>${escapeHtml(notice.publish_date)} - ${escapeHtml(notice.title)} (${escapeHtml(notice.audience)})</li>`)
        .join('');
    }
  }

  if (publicNoticeTickerTrack) {
    if (!records.length) {
      publicNoticeTickerTrack.innerHTML = '<span class="ticker-item">No notices published yet.</span>';
      publicNoticeTickerTrack.style.animation = 'none';
      return;
    }

    const lines = records.map((notice) => `${notice.publish_date}: ${notice.title} (${notice.audience})`);
    const repeated = [...lines, ...lines];
    publicNoticeTickerTrack.innerHTML = repeated.map((line) => `<span class="ticker-item">${escapeHtml(line)}</span>`).join('');
    publicNoticeTickerTrack.style.animation = '';
  }
}

async function loadPublicNotices() {
  try {
    const response = await fetch('/api/notices');
    if (!response.ok) return;

    const data = await response.json();
    if (Array.isArray(data)) {
      renderPublicNoticeWidgets(data);
    }
  } catch (_error) {
    // Public notices are optional before login.
  }
}

function setAuth(token, user) {
  authToken = token || '';
  authUser = user || null;

  if (authToken) localStorage.setItem('sms_token', authToken);
  else localStorage.removeItem('sms_token');

  scheduleTokenRefresh();
  updateAccessUI();
}

function updateAccessUI() {
  const isLoggedIn = Boolean(authUser);
  const isAdmin = authUser && authUser.role === 'Admin';

  currentUserInput.value = isLoggedIn ? `${authUser.username} (${authUser.role})` : 'Not logged in';
  authModeInput.value = isLoggedIn ? 'Access granted' : 'Please login';
  loginForm.style.display = isLoggedIn ? 'none' : 'grid';

  document.querySelectorAll('.requires-auth').forEach((el) => {
    if (el === loginForm) return;
    el.style.display = isLoggedIn ? '' : 'none';
  });

  document.querySelectorAll('.admin-only').forEach((el) => {
    el.style.display = isLoggedIn && isAdmin ? '' : 'none';
  });

  document.querySelectorAll('[data-portal-page-btn="portal"]').forEach((button) => {
    if (button.classList.contains('portal-menu-btn')) {
      button.textContent = isLoggedIn ? 'Admin Workspace' : 'Staff Login';
    } else {
      button.textContent = isLoggedIn ? 'Admin Panel' : 'Staff Login';
    }
  });
}

async function api(url, options = {}) {
  const { suppressAuthError = false, ...requestOptions } = options;
  const headers = {
    'Content-Type': 'application/json',
    ...(requestOptions.headers || {}),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(url, { ...requestOptions, headers });
  const rawBody = await response.text();
  let data = {};

  try {
    data = rawBody ? JSON.parse(rawBody) : {};
  } catch (_error) {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 401) {
      setAuth('', null);
      if (!suppressAuthError) {
        setMessage('authMsg', 'Session expired. Please login again.', 'error');
      }
    }

    const fallback = rawBody && rawBody.length < 160 ? rawBody : `Request failed (${response.status})`;
    throw new Error(data.error || fallback);
  }

  return data;
}

function clearTokenRefreshTimer() {
  if (tokenRefreshTimer) {
    clearInterval(tokenRefreshTimer);
    tokenRefreshTimer = null;
  }
}

async function refreshSessionToken() {
  if (!authToken) return null;

  const data = await api('/api/auth/me', { suppressAuthError: true });
  if (data?.user) {
    setAuth(data.token || authToken, data.user);
  }

  return data;
}

function scheduleTokenRefresh() {
  clearTokenRefreshTimer();
  if (!authToken) return;

  tokenRefreshTimer = setInterval(() => {
    refreshSessionToken().catch(() => {
      // Session cleanup is handled by api() on 401.
    });
  }, TOKEN_REFRESH_INTERVAL_MS);
}
function fillClassSelect(selectEl, allLabel) {
  if (!selectEl) return;
  const firstOption = allLabel ? `<option value="">${allLabel}</option>` : '<option value="">Select Class</option>';
  selectEl.innerHTML = firstOption;
  CLASS_OPTIONS.forEach((className) => {
    const option = document.createElement('option');
    option.value = className;
    option.textContent = className;
    selectEl.appendChild(option);
  });
}

function setClassOnSelect(selectEl, className) {
  if (!selectEl || !className) return;
  selectEl.value = className;
}

function applyClassWorkspaceSelection(className) {
  selectedWorkspaceClass = className;

  setClassOnSelect(admissionForm?.elements.className, className);
  setClassOnSelect(attendanceClass, className);
  setClassOnSelect(resultClass, className);
  setClassOnSelect(feeClass, className);
  setClassOnSelect(voucherClass, className);

  setClassOnSelect(studentClassFilter, className);
  setClassOnSelect(feeClassFilter, className);
  setClassOnSelect(attendanceClassFilter, className);
  setClassOnSelect(resultClassFilter, className);

  populateStudentSelects();
  renderClassColumns();
  applyStudentFilters();
  applyFeeFilters();

  loadAttendanceRecords().catch((error) => setMessage('attendanceMsg', error.message, 'error'));
  loadResultRecords().catch((error) => setMessage('resultMsg', error.message, 'error'));

  document.querySelectorAll('.class-chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.className === className);
  });
}

function renderClassColumns() {
  if (!classColumns) return;

  const studentCounts = CLASS_OPTIONS.reduce((acc, className) => {
    acc[className] = 0;
    return acc;
  }, {});

  allStudents.forEach((student) => {
    if (Object.prototype.hasOwnProperty.call(studentCounts, student.class_name)) {
      studentCounts[student.class_name] += 1;
    }
  });

  classColumns.innerHTML = '';

  CLASS_OPTIONS.forEach((className) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'class-chip';
    chip.dataset.className = className;
    chip.innerHTML = `<strong>Class ${className}</strong><small>${studentCounts[className]} students</small>`;

    if (selectedWorkspaceClass === className) chip.classList.add('active');

    chip.addEventListener('click', () => {
      applyClassWorkspaceSelection(className);
    });

    classColumns.appendChild(chip);
  });
}

function setupInstallPrompt() {
  if (!installAppBtn) return;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installAppBtn.hidden = false;
  });

  installAppBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;

    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installAppBtn.hidden = true;
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    installAppBtn.hidden = true;
  });
}

function activateWaitingServiceWorker(registration) {
  if (registration?.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
}

function scheduleReloadForServiceWorkerUpdate() {
  if (serviceWorkerReloadScheduled || !hadServiceWorkerControllerAtLoad) return;
  serviceWorkerReloadScheduled = true;
  window.location.reload();
}

function watchServiceWorkerRegistration(registration) {
  if (!registration) return;

  activateWaitingServiceWorker(registration);

  registration.addEventListener('updatefound', () => {
    const nextWorker = registration.installing;
    if (!nextWorker) return;

    nextWorker.addEventListener('statechange', () => {
      if (nextWorker.state === 'installed' && navigator.serviceWorker.controller) {
        activateWaitingServiceWorker(registration);
      }
    });
  });
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    scheduleReloadForServiceWorkerUpdate();
  });

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    watchServiceWorkerRegistration(registration);
    registration.update().catch(() => {});
  } catch (_error) {
    // Ignore registration failure for browsers that block SW on unsecured origins.
  }
}

function setupControls() {
  fillClassSelect(admissionForm?.elements.className);
  fillClassSelect(attendanceClass);
  fillClassSelect(resultClass);
  fillClassSelect(feeClass);
  fillClassSelect(timetableForm?.elements.className);
  fillClassSelect(voucherClass);

  fillClassSelect(studentClassFilter, 'All Classes (Students)');
  fillClassSelect(feeClassFilter, 'All Classes (Fees)');
  fillClassSelect(attendanceClassFilter, 'All Classes (Attendance)');
  fillClassSelect(resultClassFilter, 'All Classes (Results)');

  attendanceDateFilter.value = new Date().toISOString().slice(0, 10);
  const currentMonth = new Date().toISOString().slice(0, 7);
  if (!voucherForm.elements.feeMonth?.value) {
    voucherForm.elements.feeMonth.value = currentMonth;
  }
  renderClassColumns();
}

function renderStudentOptions(selectEl, students, placeholder = 'Select Student') {
  if (!selectEl) return;
  selectEl.innerHTML = `<option value="">${placeholder}</option>`;
  students.forEach((student) => {
    const option = document.createElement('option');
    option.value = student.id;
    option.textContent = `${student.full_name} (${student.admission_no})`;
    selectEl.appendChild(option);
  });
}

function getStudentsByClass(className) {
  if (!className) return [];
  const normalizedClass = String(className).trim().toLowerCase();
  return allStudents.filter((student) => String(student.class_name).toLowerCase() === normalizedClass);
}

function populateStudentSelects() {
  renderStudentOptions(attendanceStudent, getStudentsByClass(attendanceClass.value), attendanceClass.value ? 'Select Student' : 'Select Class First');
  renderStudentOptions(resultStudent, getStudentsByClass(resultClass.value), resultClass.value ? 'Select Student' : 'Select Class First');
  renderStudentOptions(feeStudent, getStudentsByClass(feeClass.value), feeClass.value ? 'Select Student' : 'Select Class First');
  renderStudentOptions(voucherStudent, getStudentsByClass(voucherClass.value), voucherClass.value ? 'Select Student' : 'Select Class First');
  updateAutoFeePreview().catch(() => {
    // Ignore auto-preview failures during select refresh.
  });
}

async function updateAutoFeePreview() {
  if (!feeTotalAmountInput) return;

  const studentId = Number(feeStudent.value || 0);
  if (!studentId) {
    feeTotalAmountInput.value = '';
    return;
  }

  try {
    const data = await api(`/api/fees/calculate?studentId=${studentId}`);
    feeTotalAmountInput.value = Number(data.totalAmount || 0).toFixed(2);
  } catch (_error) {
    feeTotalAmountInput.value = '';
  }
}

function renderStudents(students) {
  studentsTableBody.innerHTML = '';
  students.slice(0, 25).forEach((student) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${student.admission_no}</td>
      <td>${student.full_name}</td>
      <td>${student.b_form_no || '-'}</td>
      <td>${student.class_name}${student.section ? `-${student.section}` : ''}</td>
      <td>${student.phone || '-'}</td>
      ${renderActionCell('students', student, student.full_name)}
    `;
    studentsTableBody.appendChild(tr);
  });
}

function renderFees(fees) {
  feesTableBody.innerHTML = '';
  fees.slice(0, 20).forEach((fee) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${fee.full_name}</td>
      <td>${fee.class_name || '-'}${fee.section ? `-${fee.section}` : ''}</td>
      <td>${fee.fee_month}</td>
      <td>${Number(fee.paid_amount).toFixed(2)}</td>
      <td>${Number(fee.due_amount).toFixed(2)}</td>
      ${renderActionCell('fees', fee, `${fee.full_name} ${fee.fee_month}`)}
    `;
    feesTableBody.appendChild(tr);
  });
}

function renderAttendance(rows) {
  attendanceTableBody.innerHTML = '';
  rows.slice(0, 40).forEach((item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.attendance_date}</td>
      <td>${item.class_name}</td>
      <td>${item.full_name}</td>
      <td>${item.status}</td>
      <td>${item.remarks || '-'}</td>
      ${renderActionCell('attendance', item, `${item.full_name} ${item.attendance_date}`)}
    `;
    attendanceTableBody.appendChild(tr);
  });
}

function renderResults(rows) {
  resultsTableBody.innerHTML = '';
  rows.slice(0, 60).forEach((item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.class_name || '-'}${item.section ? `-${item.section}` : ''}</td>
      <td>${item.full_name}</td>
      <td>${item.exam_name}</td>
      <td>${item.subject}</td>
      <td>${item.obtained_marks}/${item.max_marks}</td>
      <td>${item.grade || '-'}</td>
      ${renderActionCell('results', item, `${item.full_name} ${item.exam_name}`)}
    `;
    resultsTableBody.appendChild(tr);
  });
}

function renderNotices(notices) {
  renderPublicNoticeWidgets(notices);
  noticesTableBody.innerHTML = '';
  notices.slice(0, 10).forEach((notice) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${notice.publish_date}</td><td>${notice.title}</td><td>${notice.audience}</td>${renderActionCell('notices', notice, notice.title)}`;
    noticesTableBody.appendChild(tr);
  });
}

function renderTimetable(rows) {
  timetableTableBody.innerHTML = '';
  rows.slice(0, 10).forEach((item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${item.weekday}</td><td>${item.class_name}${item.section ? `-${item.section}` : ''}</td><td>${item.period_name}</td><td>${item.subject}</td>${renderActionCell('timetable', item, `${item.class_name} ${item.weekday} ${item.period_name}`)}`;
    timetableTableBody.appendChild(tr);
  });
}

function formatMoney(value) {
  return Number(value || 0).toFixed(2);
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const EDIT_ALLOWED_ROLES = {
  students: ['Admin'],
  attendance: ['Admin', 'Teacher'],
  results: ['Admin', 'Teacher'],
  fees: ['Admin'],
  notices: ['Admin'],
  timetable: ['Admin'],
};

const EDIT_FORM_CONFIG = {
  students: {
    form: admissionForm,
    cancelBtn: cancelAdmissionEditBtn,
    submitLabel: 'Save Admission',
    updateLabel: 'Update Admission',
    messageId: 'admissionMsg',
  },
  attendance: {
    form: attendanceForm,
    cancelBtn: cancelAttendanceEditBtn,
    submitLabel: 'Mark Attendance',
    updateLabel: 'Update Attendance',
    messageId: 'attendanceMsg',
  },
  results: {
    form: resultForm,
    cancelBtn: cancelResultEditBtn,
    submitLabel: 'Save Result',
    updateLabel: 'Update Result',
    messageId: 'resultMsg',
  },
  fees: {
    form: feeForm,
    cancelBtn: cancelFeeEditBtn,
    submitLabel: 'Save Fee Record',
    updateLabel: 'Update Fee Record',
    messageId: 'feeMsg',
  },
  notices: {
    form: noticeForm,
    cancelBtn: cancelNoticeEditBtn,
    submitLabel: 'Publish Notice',
    updateLabel: 'Update Notice',
    messageId: 'noticeMsg',
  },
  timetable: {
    form: timetableForm,
    cancelBtn: cancelTimetableEditBtn,
    submitLabel: 'Save Timetable',
    updateLabel: 'Update Timetable',
    messageId: 'timetableMsg',
  },
};

function canEditEntity(entity) {
  if (!authUser) return false;
  const allowed = EDIT_ALLOWED_ROLES[entity];
  return Array.isArray(allowed) ? allowed.includes(authUser.role) : false;
}

function canDeleteEntity() {
  return Boolean(authUser && authUser.role === 'Admin');
}

function setEditMode(entity, id, label) {
  const config = EDIT_FORM_CONFIG[entity];
  if (!config?.form) return;
  config.form.dataset.editId = String(id || '');
  config.form.dataset.editEntity = entity;
  const submitBtn = config.form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = config.updateLabel;
  if (config.cancelBtn) config.cancelBtn.hidden = false;
  if (config.messageId) {
    const labelText = label ? ` (${label})` : '';
    setMessage(config.messageId, `Edit mode on${labelText}.`);
  }
}

function clearEditMode(entity) {
  const config = EDIT_FORM_CONFIG[entity];
  if (!config?.form) return;
  delete config.form.dataset.editId;
  delete config.form.dataset.editEntity;
  const submitBtn = config.form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = config.submitLabel;
  if (config.cancelBtn) config.cancelBtn.hidden = true;
}

function clearAllEditModes() {
  Object.keys(EDIT_FORM_CONFIG).forEach((entity) => clearEditMode(entity));
}

function setFormValue(form, name, value) {
  if (!form?.elements?.[name]) return;
  form.elements[name].value = value ?? '';
}

function scrollFormIntoView(form) {
  const section = form?.closest('section');
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function decodeRowPayload(button) {
  if (!button?.dataset?.row) return null;
  try {
    return JSON.parse(decodeURIComponent(button.dataset.row));
  } catch (_error) {
    return null;
  }
}

function startStudentEdit(row) {
  if (!row) return;
  clearAllEditModes();
  setEditMode('students', row.id, row.full_name);
  setFormValue(admissionForm, 'fullName', row.full_name || '');
  setFormValue(admissionForm, 'className', row.class_name || '');
  setFormValue(admissionForm, 'section', row.section || '');
  setFormValue(admissionForm, 'gender', row.gender || '');
  setFormValue(admissionForm, 'dob', row.dob || '');
  setFormValue(admissionForm, 'bFormNo', row.b_form_no || '');
  setFormValue(admissionForm, 'parentName', row.parent_name || '');
  setFormValue(admissionForm, 'phone', row.phone || '');
  setFormValue(admissionForm, 'admissionDate', row.admission_date || '');
  setFormValue(admissionForm, 'address', row.address || '');
  scrollFormIntoView(admissionForm);
}

function startAttendanceEdit(row) {
  if (!row) return;
  clearAllEditModes();
  setEditMode('attendance', row.id, `${row.full_name || ''} ${row.attendance_date || ''}`.trim());
  setFormValue(attendanceForm, 'className', row.class_name || '');
  populateStudentSelects();
  setFormValue(attendanceForm, 'studentId', row.student_id || '');
  setFormValue(attendanceForm, 'attendanceDate', row.attendance_date || '');
  setFormValue(attendanceForm, 'status', row.status || 'Present');
  setFormValue(attendanceForm, 'remarks', row.remarks || '');
  scrollFormIntoView(attendanceForm);
}

function startResultEdit(row) {
  if (!row) return;
  clearAllEditModes();
  setEditMode('results', row.id, `${row.full_name || ''} ${row.exam_name || ''}`.trim());
  setFormValue(resultForm, 'className', row.class_name || '');
  populateStudentSelects();
  setFormValue(resultForm, 'studentId', row.student_id || '');
  setFormValue(resultForm, 'examName', row.exam_name || '');
  setFormValue(resultForm, 'subject', row.subject || '');
  setFormValue(resultForm, 'maxMarks', row.max_marks || '');
  setFormValue(resultForm, 'obtainedMarks', row.obtained_marks || '');
  setFormValue(resultForm, 'remarks', row.remarks || '');
  scrollFormIntoView(resultForm);
}

function startFeeEdit(row) {
  if (!row) return;
  clearAllEditModes();
  setEditMode('fees', row.id, `${row.full_name || ''} ${row.fee_month || ''}`.trim());
  setFormValue(feeForm, 'className', row.class_name || '');
  populateStudentSelects();
  setFormValue(feeForm, 'studentId', row.student_id || '');
  setFormValue(feeForm, 'feeMonth', row.fee_month || '');
  setFormValue(feeForm, 'paidAmount', row.paid_amount || 0);
  setFormValue(feeForm, 'paymentDate', row.payment_date || '');
  setFormValue(feeForm, 'paymentMode', row.payment_mode || '');
  setFormValue(feeForm, 'remarks', row.remarks || '');
  if (feeTotalAmountInput) {
    feeTotalAmountInput.value = formatMoney(row.total_amount || 0);
  }
  scrollFormIntoView(feeForm);
}

function startNoticeEdit(row) {
  if (!row) return;
  clearAllEditModes();
  setEditMode('notices', row.id, row.title);
  setFormValue(noticeForm, 'title', row.title || '');
  setFormValue(noticeForm, 'audience', row.audience || 'All');
  setFormValue(noticeForm, 'publishDate', row.publish_date || '');
  setFormValue(noticeForm, 'body', row.body || '');
  scrollFormIntoView(noticeForm);
}

function startTimetableEdit(row) {
  if (!row) return;
  clearAllEditModes();
  setEditMode('timetable', row.id, `${row.class_name || ''} ${row.weekday || ''}`.trim());
  setFormValue(timetableForm, 'className', row.class_name || '');
  setFormValue(timetableForm, 'section', row.section || '');
  setFormValue(timetableForm, 'weekday', row.weekday || 'Monday');
  setFormValue(timetableForm, 'periodName', row.period_name || '');
  setFormValue(timetableForm, 'subject', row.subject || '');
  setFormValue(timetableForm, 'teacherName', row.teacher_name || '');
  setFormValue(timetableForm, 'startTime', row.start_time || '');
  setFormValue(timetableForm, 'endTime', row.end_time || '');
  scrollFormIntoView(timetableForm);
}

const EDIT_HANDLERS = {
  students: startStudentEdit,
  attendance: startAttendanceEdit,
  results: startResultEdit,
  fees: startFeeEdit,
  notices: startNoticeEdit,
  timetable: startTimetableEdit,
};

const EDIT_MESSAGE_TARGET = {
  students: 'admissionMsg',
  attendance: 'attendanceMsg',
  results: 'resultMsg',
  fees: 'feeMsg',
  notices: 'noticeMsg',
  timetable: 'timetableMsg',
};



function renderActionCell(entity, item, label) {
  if (!authUser) return '<td>-</td>';
  const canEdit = canEditEntity(entity);
  const canDelete = canDeleteEntity();
  if (!canEdit && !canDelete) return '<td>-</td>';

  const safeLabel = escapeHtml(label || '');
  const itemId = item && item.id ? item.id : '';
  const rowData = encodeURIComponent(JSON.stringify(item || {}));
  const editBtn = canEdit
    ? `<button type="button" class="action-btn edit-btn" data-entity="${entity}" data-id="${itemId}" data-label="${safeLabel}" data-row="${rowData}" onclick="handleEditClick(event, this)">Edit</button>`
    : '';
  const deleteBtn = canDelete
    ? `<button type="button" class="action-btn delete-btn" data-entity="${entity}" data-id="${itemId}" data-label="${safeLabel}" onclick="handleDeleteClick(event, this)">Delete</button>`
    : '';
  const spacer = editBtn && deleteBtn ? ' ' : '';
  return `<td class="action-cell">${editBtn}${spacer}${deleteBtn}</td>`;
}

const VOUCHER_SCHOOL_PROFILE = {
  name: 'The Scholar Kids School',
  contact: '#03111652325',
};

function formatFeeMonthLabel(feeMonth) {
  const value = String(feeMonth || '').trim();
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return value || '-';

  const monthIndex = Number(match[2]) - 1;
  const date = new Date(Number(match[1]), monthIndex, 1);
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

function getVoucherNumber(feeMonth, feeRecord, studentId) {
  const monthCode = String(feeMonth || '').replace('-', '') || '000000';
  const serial = String(feeRecord?.id || studentId || Date.now()).padStart(4, '0').slice(-6);
  return `TSKS-${monthCode}-${serial}`;
}

function findVoucherFeeRecord(studentId, feeMonth) {
  return allFees.find((fee) => Number(fee.student_id) === Number(studentId) && String(fee.fee_month) === String(feeMonth));
}

function calculateOutstandingDue(studentId) {
  return allFees
    .filter((fee) => Number(fee.student_id) === Number(studentId))
    .reduce((total, fee) => total + Math.max(Number(fee.due_amount || 0), 0), 0);
}

function setVoucherActionsState(enabled) {
  const isEnabled = Boolean(enabled);
  saveVoucherBtn.disabled = !isEnabled;
  printVoucherBtn.disabled = !isEnabled;
}

function clearVoucherPreview() {
  currentVoucher = null;
  voucherPreview.innerHTML = '';
  setVoucherActionsState(false);
}

function createVoucherFromSelection({ requireFeeRecord = false, silent = false } = {}) {
  const payload = getFormData(voucherForm);
  const studentId = Number(payload.studentId || 0);
  const feeMonth = String(payload.feeMonth || '').trim();

  if (!studentId || !feeMonth) {
    if (!silent) throw new Error('Class, student aur fee month select karein.');
    return null;
  }

  const selectedStudent = allStudents.find((student) => Number(student.id) === studentId);
  if (!selectedStudent) {
    if (!silent) throw new Error('Student record nahi mila.');
    return null;
  }

  const feeRecord = findVoucherFeeRecord(studentId, feeMonth);
  if (requireFeeRecord && !feeRecord) return null;

  const outstandingDue = calculateOutstandingDue(studentId);
  const currentDue = Number(feeRecord?.due_amount || 0);
  const className = `${selectedStudent.class_name}${selectedStudent.section ? `-${selectedStudent.section}` : ''}`;
  const issueDate = new Date().toLocaleDateString();

  currentVoucher = {
    schoolName: VOUCHER_SCHOOL_PROFILE.name,
    schoolContact: VOUCHER_SCHOOL_PROFILE.contact,
    voucherNo: getVoucherNumber(feeMonth, feeRecord, studentId),
    studentName: selectedStudent.full_name,
    admissionNo: selectedStudent.admission_no || '-',
    bFormNo: selectedStudent.b_form_no || '-',
    parentName: selectedStudent.parent_name || '-',
    phone: selectedStudent.phone || '-',
    className,
    feeMonth,
    feeMonthLabel: formatFeeMonthLabel(feeMonth),
    totalAmount: Number(feeRecord?.total_amount || 0),
    paidAmount: Number(feeRecord?.paid_amount || 0),
    dueAmount: currentDue,
    outstandingDue,
    payableNow: Math.max(outstandingDue, currentDue),
    paymentDate: feeRecord?.payment_date || '-',
    paymentMode: feeRecord?.payment_mode || '-',
    issueDate,
    generatedAt: new Date().toLocaleString(),
    hasFeeRecord: Boolean(feeRecord),
  };

  renderVoucher(currentVoucher);
  setVoucherActionsState(true);

  if (!silent) {
    setMessage(
      'voucherMsg',
      feeRecord
        ? 'Professional voucher generate ho gaya.'
        : 'Voucher generate hua, lekin selected month ka fee record abhi nahi mila.'
    );
  }

  return currentVoucher;
}

function syncVoucherAutoGenerate() {
  const voucher = createVoucherFromSelection({ requireFeeRecord: true, silent: true });
  if (!voucher) {
    clearVoucherPreview();
  }
}

function buildVoucherMarkup(data) {
  return `
    <div class="voucher-card voucher-paper">
      <div class="voucher-header voucher-banner">
        <div class="voucher-school">
          <h3>${escapeHtml(data.schoolName)}</h3>
          <p>Professional School Fee Voucher</p>
        </div>
        <div class="voucher-meta">
          <p><strong>Voucher No:</strong> ${escapeHtml(data.voucherNo)}</p>
          <p><strong>Issue Date:</strong> ${escapeHtml(data.issueDate)}</p>
          <p><strong>Contact:</strong> ${escapeHtml(data.schoolContact)}</p>
        </div>
      </div>

      <div class="voucher-section">
        <h4 class="voucher-section-title">Student Information</h4>
        <div class="voucher-grid voucher-info-grid">
          <p><strong>Student Name:</strong> ${escapeHtml(data.studentName)}</p>
          <p><strong>Admission No:</strong> ${escapeHtml(data.admissionNo)}</p>
          <p><strong>B-Form No:</strong> ${escapeHtml(data.bFormNo)}</p>
          <p><strong>Parent/Guardian:</strong> ${escapeHtml(data.parentName)}</p>
          <p><strong>Class:</strong> ${escapeHtml(data.className)}</p>
          <p><strong>Contact:</strong> ${escapeHtml(data.phone)}</p>
          <p><strong>Fee Month:</strong> ${escapeHtml(data.feeMonthLabel)}</p>
          <p><strong>Payment Date:</strong> ${escapeHtml(data.paymentDate)}</p>
          <p><strong>Payment Mode:</strong> ${escapeHtml(data.paymentMode)}</p>
        </div>
      </div>

      <div class="voucher-section">
        <h4 class="voucher-section-title">Fee Summary</h4>
        <table class="voucher-amount-table">
          <tbody>
            <tr>
              <th>Total Fee</th>
              <td>Rs. ${formatMoney(data.totalAmount)}</td>
            </tr>
            <tr>
              <th>Paid Amount</th>
              <td>Rs. ${formatMoney(data.paidAmount)}</td>
            </tr>
            <tr>
              <th>Current Month Due</th>
              <td>Rs. ${formatMoney(data.dueAmount)}</td>
            </tr>
            <tr>
              <th>Total Outstanding Due</th>
              <td>Rs. ${formatMoney(data.outstandingDue)}</td>
            </tr>
            <tr class="payable-row">
              <th>Payable Now</th>
              <td>Rs. ${formatMoney(data.payableNow)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="voucher-signatures">
        <p><strong>Parent Signature:</strong> ____________________</p>
        <p><strong>Accounts Office:</strong> ____________________</p>
      </div>
      <p class="voucher-note">Generated on ${escapeHtml(data.generatedAt)} | ${escapeHtml(data.schoolName)} | ${escapeHtml(data.schoolContact)}</p>
    </div>
  `;
}

function renderVoucher(data) {
  voucherPreview.innerHTML = buildVoucherMarkup(data);
}

function voucherDocumentStyles() {
  return `
    body { margin: 0; padding: 22px; background: #f4f7f5; font-family: Arial, sans-serif; color: #162f25; }
    .voucher-paper { max-width: 860px; margin: 0 auto; border: 1px solid #c5d6cd; border-radius: 12px; background: #ffffff; padding: 18px; }
    .voucher-banner { display: flex; justify-content: space-between; gap: 18px; border-bottom: 2px solid #d3e1da; padding-bottom: 12px; margin-bottom: 12px; }
    .voucher-school h3 { margin: 0 0 5px; font-size: 24px; color: #0e4638; text-transform: uppercase; }
    .voucher-school p { margin: 0; color: #3d6757; font-weight: 600; }
    .voucher-meta p { margin: 2px 0; font-size: 13px; }
    .voucher-section { margin-bottom: 12px; }
    .voucher-section-title { margin: 0 0 7px; font-size: 15px; color: #1c4b3e; text-transform: uppercase; letter-spacing: 0.4px; }
    .voucher-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; }
    .voucher-grid p { margin: 0; font-size: 14px; }
    .voucher-amount-table { width: 100%; border-collapse: collapse; }
    .voucher-amount-table th, .voucher-amount-table td { border: 1px solid #d0ded7; padding: 8px; text-align: left; font-size: 14px; }
    .voucher-amount-table th { width: 65%; background: #eef5f1; }
    .voucher-amount-table .payable-row th, .voucher-amount-table .payable-row td { font-weight: 700; background: #edf7f1; }
    .voucher-signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 18px; }
    .voucher-signatures p { margin: 0; font-size: 13px; }
    .voucher-note { margin-top: 12px; font-size: 12px; color: #4d6a5e; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .voucher-paper { border: 0; border-radius: 0; max-width: none; margin: 0; }
    }
  `;
}

function buildVoucherDocument(data, title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <style>${voucherDocumentStyles()}</style>
</head>
<body>
  ${buildVoucherMarkup(data)}
</body>
</html>`;
}

function saveVoucherFile() {
  if (!currentVoucher) return;
  const doc = buildVoucherDocument(currentVoucher, 'Fee Voucher');
  const blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
  const fileName = `voucher_${currentVoucher.admissionNo || 'student'}_${currentVoucher.feeMonth}.html`;
  const link = document.createElement('a');
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);

  setMessage('voucherMsg', 'Voucher file save ho gaya.');
}

function printVoucherFile() {
  if (!currentVoucher) return;

  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    setMessage('voucherMsg', 'Popup blocked hai. Browser mein popups allow karein.', 'error');
    return;
  }

  printWindow.document.write(buildVoucherDocument(currentVoucher, 'Print Fee Voucher'));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function applyStudentFilters() {
  const selectedClass = studentClassFilter.value.trim().toLowerCase();
  const searchTerm = studentSearchInput.value.trim().toLowerCase();

  const filtered = allStudents.filter((student) => {
    const classOk = !selectedClass || String(student.class_name).toLowerCase() === selectedClass;
    if (!classOk) return false;

    if (!searchTerm) return true;

    const haystack = [student.full_name, student.admission_no, student.b_form_no || ''].join(' ').toLowerCase();
    return haystack.includes(searchTerm);
  });

  renderStudents(filtered);
}

function applyFeeFilters() {
  const selectedClass = feeClassFilter.value.trim().toLowerCase();
  const filtered = allFees.filter((fee) => !selectedClass || String(fee.class_name || '').toLowerCase() === selectedClass);
  renderFees(filtered);
}

function normalizeDate(rawDate) {
  if (!rawDate) return null;
  const value = rawDate.trim();
  const yyyyMmDd = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/;
  const ddMmYyyy = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/;

  let y;
  let m;
  let d;

  if (yyyyMmDd.test(value)) {
    const match = value.match(yyyyMmDd);
    y = Number(match[1]);
    m = Number(match[2]);
    d = Number(match[3]);
  } else if (ddMmYyyy.test(value)) {
    const match = value.match(ddMmYyyy);
    y = Number(match[3]);
    m = Number(match[2]);
    d = Number(match[1]);
  } else {
    return null;
  }

  if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function normalizeOcrText(rawText) {
  const digitMap = {
    '\u06F0': '0', '\u06F1': '1', '\u06F2': '2', '\u06F3': '3', '\u06F4': '4',
    '\u06F5': '5', '\u06F6': '6', '\u06F7': '7', '\u06F8': '8', '\u06F9': '9',
    '\u0660': '0', '\u0661': '1', '\u0662': '2', '\u0663': '3', '\u0664': '4',
    '\u0665': '5', '\u0666': '6', '\u0667': '7', '\u0668': '8', '\u0669': '9',
  };

  return String(rawText || '')
    .replace(/[\u06F0-\u06F9\u0660-\u0669]/g, (ch) => digitMap[ch] || ch)
    .replace(/[\u060C]/g, ',')
    .replace(/[\u06D4]/g, '.')
    .replace(/[\u0640]/g, '')
    .replace(/\r/g, '')
    .replace(/[\u200f\u200e]/g, '')
    .trim();
}

function cleanExtractedName(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/[|,:;]+$/g, '')
    .trim();
}

function toTitleCase(value) {
  return String(value || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function transliterateUrduName(value) {
  const text = String(value || '').trim();
  if (!text) return '';

  const wordMap = {
    '\u0645\u062D\u0645\u062F': 'Muhammad',
    '\u0627\u062D\u0645\u062F': 'Ahmed',
    '\u0639\u0644\u06CC': 'Ali',
    '\u062D\u0633\u0646': 'Hasan',
    '\u062D\u0633\u06CC\u0646': 'Hussain',
    '\u0641\u0627\u0637\u0645\u06C1': 'Fatima',
    '\u0632\u06C1\u0631\u0627': 'Zehra',
    '\u0639\u0628\u062F': 'Abdul',
    '\u0631\u062D\u0645\u0627\u0646': 'Rehman',
    '\u0628\u06CC\u0628\u06CC': 'Bibi',
    '\u062E\u0627\u0646': 'Khan',
    '\u0628\u0646\u062A': 'Bint',
    '\u0628\u0646': 'Bin',
  };

  const charMap = {
    '\u0627': 'a', '\u0622': 'aa', '\u0623': 'a', '\u0625': 'i',
    '\u0628': 'b', '\u067E': 'p', '\u062A': 't', '\u0679': 't',
    '\u062B': 's', '\u062C': 'j', '\u0686': 'ch', '\u062D': 'h',
    '\u062E': 'kh', '\u062F': 'd', '\u0688': 'd', '\u0630': 'z',
    '\u0631': 'r', '\u0691': 'r', '\u0632': 'z', '\u0698': 'zh',
    '\u0633': 's', '\u0634': 'sh', '\u0635': 's', '\u0636': 'z',
    '\u0637': 't', '\u0638': 'z', '\u0639': 'a', '\u063A': 'gh',
    '\u0641': 'f', '\u0642': 'q', '\u06A9': 'k', '\u06AF': 'g',
    '\u0644': 'l', '\u0645': 'm', '\u0646': 'n', '\u06BA': 'n',
    '\u0648': 'o', '\u06C1': 'h', '\u06BE': 'h', '\u0621': "'",
    '\u06CC': 'y', '\u06D2': 'e', '\u0624': 'o', '\u0626': 'y',
    '\u0629': 't', '\u0649': 'a', '\u064E': '', '\u064F': '',
    '\u0650': '', '\u0651': '', '\u0652': '', '\u0640': '',
  };

  const tokens = text.split(/\s+/).filter(Boolean);
  const romanTokens = tokens.map((token) => {
    if (!/[\u0600-\u06FF]/.test(token)) return token;
    if (wordMap[token]) return wordMap[token];

    let converted = '';
    for (const ch of token) converted += charMap[ch] || '';
    if (!converted) return token;
    return converted;
  });

  return toTitleCase(
    romanTokens
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function ensureEnglishName(value) {
  const cleaned = cleanExtractedName(value);
  if (!cleaned) return '';
  if (!/[\u0600-\u06FF]/.test(cleaned)) return cleaned;
  return transliterateUrduName(cleaned) || cleaned;
}

function findLabeledValue(lines, patterns, cleaner = (v) => v.trim()) {
  for (const line of lines) {
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match && match[1]) {
        const value = cleaner(match[1]);
        if (value) return value;
      }
    }
  }

  return '';
}
function formatBFormFromDigits(digits) {
  if (!digits || digits.length !== 13) return '';
  return digits.slice(0, 5) + '-' + digits.slice(5, 12) + '-' + digits.slice(12);
}

function extractBFormNumber(lines, joinedText) {
  const keywordRegex = /(?:b\s*[- ]?form|\u0628\s*\u0641\u0627\u0631\u0645|\u0634\u0646\u0627\u062E\u062A\u06CC)/i;

  for (let i = 0; i < lines.length; i += 1) {
    if (!keywordRegex.test(lines[i])) continue;

    const windowText = lines[i] + ' ' + (lines[i + 1] || '');
    const match = windowText.match(/(?:\d[\d\s-]{10,24}\d)/);
    if (!match) continue;

    const digits = match[0].replace(/\D/g, '').slice(0, 13);
    const formatted = formatBFormFromDigits(digits);
    if (formatted) return formatted;
  }

  const patternMatch = joinedText.match(/\b(\d{5})[\s-]?(\d{7})[\s-]?(\d)\b/);
  if (patternMatch) return patternMatch[1] + '-' + patternMatch[2] + '-' + patternMatch[3];

  const grouped = joinedText.match(/(?:\d[\s-]*){13}/);
  if (grouped) {
    const digits = grouped[0].replace(/\D/g, '').slice(0, 13);
    const formatted = formatBFormFromDigits(digits);
    if (formatted) return formatted;
  }

  return '';
}


function parseAdmissionText(text) {
  const normalizedText = normalizeOcrText(text);
  const lines = normalizedText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const joined = lines.join(' | ');
  const result = {};

  const bFormNo = extractBFormNumber(lines, joined);
  if (bFormNo) result.bFormNo = bFormNo;

  const phoneMatch = joined.match(/\b(?:\+92|0)3\d{2}[\s-]?\d{7}\b/);
  if (phoneMatch) result.phone = phoneMatch[0].replace(/\s+/g, '').replace(/-/g, '');

  const dobLabeled = findLabeledValue(lines, [
    /(?:DOB|D\.O\.B|Date\s*of\s*Birth|\u062A\u0627\u0631\u06CC\u062E\s*\u067E\u06CC\u062F\u0627\u0626\u0634|\u067E\u06CC\u062F\u0627\u0626\u0634)\s*[:\-]?\s*(\d{1,2}[-/.]\d{1,2}[-/.]\d{4}|\d{4}[-/.]\d{1,2}[-/.]\d{1,2})/i,
  ]);
  if (dobLabeled) {
    const normalized = normalizeDate(dobLabeled);
    if (normalized) result.dob = normalized;
  }

  const parentName = findLabeledValue(
    lines,
    [
      /(?:Father\s*Name|Mother\s*Name|Parent\s*Name|Guardian\s*Name|\u0648\u0627\u0644\u062F\s*\u06A9\u0627\s*\u0646\u0627\u0645|\u0648\u0627\u0644\u062F\u06C1\s*\u06A9\u0627\s*\u0646\u0627\u0645|\u0633\u0631\u067E\u0631\u0633\u062A\s*\u06A9\u0627\s*\u0646\u0627\u0645|\u0648\u0644\u062F\u06CC\u062A)\s*[:\-]?\s*([A-Za-z\u0600-\u06FF\s.'-]{2,100})/i,
    ],
    cleanExtractedName
  );
  if (parentName) result.parentName = parentName;

  const studentName = findLabeledValue(
    lines,
    [
      /(?:Student\s*Name|Child\s*Name|\u0637\u0627\u0644\u0628\s*\u0639\u0644\u0645\s*\u06A9\u0627\s*\u0646\u0627\u0645|\u0637\u0627\u0644\u0628\u0639\u0644\u0645\s*\u06A9\u0627\s*\u0646\u0627\u0645|\u0628\u0686\u06D2\s*\u06A9\u0627\s*\u0646\u0627\u0645|\u0646\u0627\u0645)\s*[:\-]?\s*([A-Za-z\u0600-\u06FF\s.'-]{2,100})/i,
    ],
    cleanExtractedName
  );

  if (studentName) {
    const avoid = /(father|mother|guardian|\u0648\u0627\u0644\u062F|\u0648\u0627\u0644\u062F\u06C1|\u0633\u0631\u067E\u0631\u0633\u062A|\u0648\u0644\u062F\u06CC\u062A)/i;
    if (!avoid.test(studentName)) result.fullName = studentName;
  }

  if (!result.fullName) {
    const candidate = lines.find((line) => {
      if (/(father|mother|guardian|\u0648\u0627\u0644\u062F|\u0648\u0627\u0644\u062F\u06C1|\u0633\u0631\u067E\u0631\u0633\u062A|\u0648\u0644\u062F\u06CC\u062A|\u067E\u062A\u06C1|address|DOB|\u062A\u0627\u0631\u06CC\u062E|\u0628\s*\u0641\u0627\u0631\u0645|form|\u0634\u0646\u0627\u062E\u062A\u06CC)/i.test(line)) return false;
      const cleaned = line.replace(/[^A-Za-z\u0600-\u06FF\s.'-]/g, '').trim();
      return cleaned.length >= 4 && cleaned.length <= 60;
    });
    if (candidate) result.fullName = cleanExtractedName(candidate);
  }

  const address = findLabeledValue(lines, [
    /(?:Address|\u067E\u062A\u06C1)\s*[:\-]?\s*(.{4,140})/i,
  ]);
  if (address) result.address = address;

  if (result.fullName) result.fullName = ensureEnglishName(result.fullName);
  if (result.parentName) result.parentName = ensureEnglishName(result.parentName);

  return result;
}

function loadTesseract() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (tesseractLoadPromise) return tesseractLoadPromise;

  tesseractLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    script.async = true;
    script.onload = () => {
      if (window.Tesseract) resolve(window.Tesseract);
      else reject(new Error('OCR library load nahi hui. Page refresh karke dobara try karein.'));
    };
    script.onerror = () => {
      reject(new Error('OCR library download nahi hui. Internet check karein aur dobara try karein.'));
    };
    document.head.appendChild(script);
  });

  return tesseractLoadPromise;
}

async function extractTextWithTextDetector(file) {
  const bitmap = await createImageBitmap(file);
  const detector = new window.TextDetector();
  const blocks = await detector.detect(bitmap);
  bitmap.close();

  const text = blocks.map((block) => block.rawValue).join('\n').trim();
  if (!text) throw new Error('Image se text read nahi hua. Clear image upload karein.');
  return text;
}

async function extractTextWithTesseract(file) {
  const Tesseract = await loadTesseract();
  const result = await Tesseract.recognize(file, 'urd+eng');
  const text = String(result?.data?.text || '').trim();
  if (!text) throw new Error('Image se text read nahi hua. Seedhi aur clear image upload karein.');
  return text;
}

async function extractTextFromImage(file) {
  if ('TextDetector' in window) {
    try {
      return await extractTextWithTextDetector(file);
    } catch (_error) {
      // Continue to fallback OCR.
    }
  }

  return extractTextWithTesseract(file);
}

function fillAdmissionFromParsedData(parsed) {
  if (parsed.fullName) admissionForm.elements.fullName.value = parsed.fullName;
  if (parsed.bFormNo) admissionForm.elements.bFormNo.value = parsed.bFormNo;
  if (parsed.parentName) admissionForm.elements.parentName.value = parsed.parentName;
  if (parsed.dob) admissionForm.elements.dob.value = parsed.dob;
  if (parsed.phone) admissionForm.elements.phone.value = parsed.phone;
  if (parsed.address) admissionForm.elements.address.value = parsed.address;
}

async function loadDashboard() {
  const data = await api('/api/dashboard');
  document.getElementById('totalStudents').textContent = data.students;
  document.getElementById('todayPresent').textContent = data.todayPresent;
  document.getElementById('totalDue').textContent = Number(data.totalFeeDue).toFixed(2);
  document.getElementById('resultEntries').textContent = data.resultEntries;
  document.getElementById('noticeCount').textContent = data.notices;
  document.getElementById('timetableCount').textContent = data.timetableEntries;
}

async function loadAttendanceRecords() {
  const selectedClass = attendanceClassFilter.value;
  const selectedDate = attendanceDateFilter.value || new Date().toISOString().slice(0, 10);
  const params = new URLSearchParams({ attendanceDate: selectedDate });
  if (selectedClass) params.set('className', selectedClass);
  renderAttendance(await api(`/api/attendance?${params.toString()}`));
}

async function loadResultRecords() {
  const selectedClass = resultClassFilter.value;
  if (!selectedClass) {
    renderResults([]);
    return;
  }

  const examName = resultExamFilter.value.trim();
  const params = new URLSearchParams({ className: selectedClass });
  if (examName) params.set('examName', examName);
  renderResults(await api(`/api/results?${params.toString()}`));
}

async function refreshData() {
  if (!authUser) return;

  const [students, fees, notices, timetable] = await Promise.all([
    api('/api/students'),
    api('/api/fees'),
    api('/api/notices'),
    api('/api/timetable'),
  ]);

  allStudents = students;
  allFees = fees;

  populateStudentSelects();
  renderClassColumns();
  applyStudentFilters();
  applyFeeFilters();
  renderNotices(notices);
  renderTimetable(timetable);
  syncVoucherAutoGenerate();

  await Promise.all([loadAttendanceRecords(), loadResultRecords(), loadDashboard()]);
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = getFormData(loginForm);
    const data = await api('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) });
    setAuth(data.token, data.user);
    loginForm.reset();
    setMessage('authMsg', 'Login successful.');
    await refreshData();
    setPortalPage('portal');
  } catch (error) {
    setMessage('authMsg', error.message, 'error');
  }
});

logoutBtn.addEventListener('click', () => {
  setAuth('', null);
  setMessage('authMsg', 'Logged out.');
  setPortalPage('home');
});

userForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = getFormData(userForm);
    await api('/api/auth/users', { method: 'POST', body: JSON.stringify(payload) });
    userForm.reset();
    setMessage('authMsg', 'User created successfully.');
  } catch (error) {
    setMessage('authMsg', error.message, 'error');
  }
});

admissionForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = getFormData(admissionForm);
    const editId = Number(admissionForm.dataset.editId || 0);

    if (editId) {
      await api(`/api/students/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
      clearEditMode('students');
      admissionForm.reset();
      setMessage('admissionMsg', 'Admission updated successfully.');
    } else {
      await api('/api/admissions', { method: 'POST', body: JSON.stringify(payload) });
      admissionForm.reset();
      setMessage('admissionMsg', 'Admission saved successfully.');
    }

    await refreshData();
  } catch (error) {
    setMessage('admissionMsg', error.message, 'error');
  }
});

extractFromPhotoBtn.addEventListener('click', async () => {
  try {
    if (!admissionForm.elements.className.value) throw new Error('Pehle class select karein.');
    const file = bFormPhotoInput.files[0];
    if (!file) throw new Error('B-Form ki image select karein.');

    setMessage('admissionMsg', 'Image process ho rahi hai... Urdu/English OCR first time 20-40 sec lag sakte hain.');
    fillAdmissionFromParsedData(parseAdmissionText(await extractTextFromImage(file)));
    setMessage('admissionMsg', 'Auto-fill complete. Verify karke Save Admission karein.');
  } catch (error) {
    setMessage('admissionMsg', error.message, 'error');
  }
});

attendanceForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = getFormData(attendanceForm);
    payload.studentId = Number(payload.studentId);
    const editId = Number(attendanceForm.dataset.editId || 0);

    if (editId) {
      await api(`/api/attendance/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
      clearEditMode('attendance');
      setMessage('attendanceMsg', 'Attendance updated successfully.');
    } else {
      await api('/api/attendance', { method: 'POST', body: JSON.stringify(payload) });
      setMessage('attendanceMsg', 'Attendance saved successfully.');
    }

    const selectedClass = payload.className;
    const selectedDate = payload.attendanceDate;
    attendanceForm.reset();
    attendanceForm.elements.className.value = selectedClass;
    attendanceForm.elements.attendanceDate.value = selectedDate;
    attendanceClassFilter.value = selectedClass;
    attendanceDateFilter.value = selectedDate;

    populateStudentSelects();
    await Promise.all([loadAttendanceRecords(), loadDashboard()]);
  } catch (error) {
    setMessage('attendanceMsg', error.message, 'error');
  }
});

resultForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = getFormData(resultForm);
    payload.studentId = Number(payload.studentId);
    payload.maxMarks = Number(payload.maxMarks);
    payload.obtainedMarks = Number(payload.obtainedMarks);
    const editId = Number(resultForm.dataset.editId || 0);

    if (editId) {
      await api(`/api/results/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
      clearEditMode('results');
      setMessage('resultMsg', 'Result updated successfully.');
    } else {
      await api('/api/results', { method: 'POST', body: JSON.stringify(payload) });
      setMessage('resultMsg', 'Result saved successfully.');
    }

    const selectedClass = payload.className;
    resultForm.reset();
    resultForm.elements.className.value = selectedClass;
    resultClassFilter.value = selectedClass;

    populateStudentSelects();
    await Promise.all([loadResultRecords(), loadDashboard()]);
  } catch (error) {
    setMessage('resultMsg', error.message, 'error');
  }
});

feeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = getFormData(feeForm);
    payload.studentId = Number(payload.studentId);
    payload.paidAmount = Number(payload.paidAmount || 0);
    payload.feeMonth = resolveFeeMonth(payload.feeMonth, payload.paymentDate);
    if (!payload.feeMonth) throw new Error('Fee month ya payment date select karein.');

    const editId = Number(feeForm.dataset.editId || 0);
    let saved;

    if (editId) {
      saved = await api(`/api/fees/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
      clearEditMode('fees');
    } else {
      saved = await api('/api/fees', { method: 'POST', body: JSON.stringify(payload) });
    }

    const selectedClass = payload.className;
    feeForm.reset();
    feeForm.elements.className.value = selectedClass;
    populateStudentSelects();

    const verb = editId ? 'updated' : 'saved';
    setMessage('feeMsg', `Fee record ${verb}. Total: Rs. ${Number(saved.total_amount || 0).toFixed(2)}, Due: Rs. ${Number(saved.due_amount || 0).toFixed(2)}`);
    await refreshData();

    voucherClass.value = payload.className;
    populateStudentSelects();
    voucherStudent.value = String(saved.student_id || payload.studentId);
    voucherForm.elements.feeMonth.value = String(saved.fee_month || payload.feeMonth);
    syncVoucherAutoGenerate();
    if (currentVoucher) {
      setMessage('voucherMsg', 'Fee record mil gaya. Voucher auto-generate ho gaya.');
    }
  } catch (error) {
    setMessage('feeMsg', error.message, 'error');
  }
});

noticeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = getFormData(noticeForm);
    const editId = Number(noticeForm.dataset.editId || 0);

    if (editId) {
      await api(`/api/notices/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
      clearEditMode('notices');
      noticeForm.reset();
      setMessage('noticeMsg', 'Notice updated successfully.');
    } else {
      await api('/api/notices', { method: 'POST', body: JSON.stringify(payload) });
      noticeForm.reset();
      setMessage('noticeMsg', 'Notice published successfully.');
    }

    await refreshData();
  } catch (error) {
    setMessage('noticeMsg', error.message, 'error');
  }
});

timetableForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = getFormData(timetableForm);
    const editId = Number(timetableForm.dataset.editId || 0);

    if (editId) {
      await api(`/api/timetable/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
      clearEditMode('timetable');
      timetableForm.reset();
      setMessage('timetableMsg', 'Timetable entry updated successfully.');
    } else {
      await api('/api/timetable', { method: 'POST', body: JSON.stringify(payload) });
      timetableForm.reset();
      setMessage('timetableMsg', 'Timetable entry saved successfully.');
    }

    await refreshData();
  } catch (error) {
    setMessage('timetableMsg', error.message, 'error');
  }
});

cancelAdmissionEditBtn?.addEventListener('click', () => {
  admissionForm.reset();
  clearEditMode('students');
});

cancelAttendanceEditBtn?.addEventListener('click', () => {
  attendanceForm.reset();
  clearEditMode('attendance');
});

cancelResultEditBtn?.addEventListener('click', () => {
  resultForm.reset();
  clearEditMode('results');
});

cancelFeeEditBtn?.addEventListener('click', () => {
  feeForm.reset();
  clearEditMode('fees');
});

cancelNoticeEditBtn?.addEventListener('click', () => {
  noticeForm.reset();
  clearEditMode('notices');
});

cancelTimetableEditBtn?.addEventListener('click', () => {
  timetableForm.reset();
  clearEditMode('timetable');
});

voucherForm.addEventListener('submit', (e) => {
  e.preventDefault();
  try {
    createVoucherFromSelection({ requireFeeRecord: false, silent: false });
  } catch (error) {
    setMessage('voucherMsg', error.message, 'error');
  }
});

autoGenerateFeeBtn?.addEventListener('click', async () => {
  try {
    const paymentDate = feeForm.elements.paymentDate?.value;
    const feeMonth = resolveFeeMonth(feeForm.elements.feeMonth?.value, paymentDate);
    if (!feeMonth) throw new Error('Fee month ya payment date select karein.');

    const className = feeForm.elements.className?.value;
    if (!className) throw new Error('Class select karein.');

    const summary = await api('/api/fees/auto-generate', {
      method: 'POST',
      body: JSON.stringify({ feeMonth, paymentDate, className }),
    });

    setMessage('feeMsg', `Auto fee complete. Created: ${summary.createdCount}, Skipped (already exists): ${summary.skippedCount}`);

    await refreshData();
  } catch (error) {
    setMessage('feeMsg', error.message, 'error');
  }
});

saveVoucherBtn.addEventListener('click', saveVoucherFile);
printVoucherBtn.addEventListener('click', printVoucherFile);

attendanceClass.addEventListener('change', populateStudentSelects);
resultClass.addEventListener('change', populateStudentSelects);
feeClass.addEventListener('change', () => {
  populateStudentSelects();
  updateAutoFeePreview().catch(() => {});
});
feeStudent.addEventListener('change', () => updateAutoFeePreview().catch(() => {}));
feeForm.elements.paymentDate?.addEventListener('change', () => {
  const monthInput = feeForm.elements.feeMonth;
  if (!monthInput?.value) {
    monthInput.value = feeMonthFromPaymentDate(feeForm.elements.paymentDate?.value);
  }
});
voucherClass.addEventListener('change', () => {
  populateStudentSelects();
  syncVoucherAutoGenerate();
});
voucherStudent.addEventListener('change', syncVoucherAutoGenerate);
voucherForm.elements.feeMonth?.addEventListener('change', syncVoucherAutoGenerate);

studentClassFilter.addEventListener('change', applyStudentFilters);
studentSearchInput.addEventListener('input', applyStudentFilters);
feeClassFilter.addEventListener('change', applyFeeFilters);
attendanceClassFilter.addEventListener('change', () => loadAttendanceRecords().catch((error) => setMessage('attendanceMsg', error.message, 'error')));
attendanceDateFilter.addEventListener('change', () => loadAttendanceRecords().catch((error) => setMessage('attendanceMsg', error.message, 'error')));
loadAttendanceBtn.addEventListener('click', () => loadAttendanceRecords().catch((error) => setMessage('attendanceMsg', error.message, 'error')));
resultClassFilter.addEventListener('change', () => loadResultRecords().catch((error) => setMessage('resultMsg', error.message, 'error')));
resultExamFilter.addEventListener('input', () => loadResultRecords().catch((error) => setMessage('resultMsg', error.message, 'error')));


const DELETE_ENTITY_LABELS = {
  students: 'student',
  attendance: 'attendance record',
  results: 'result',
  fees: 'fee record',
  notices: 'notice',
  timetable: 'timetable entry',
};

const DELETE_MESSAGE_TARGET = {
  students: 'admissionMsg',
  attendance: 'attendanceMsg',
  results: 'resultMsg',
  fees: 'feeMsg',
  notices: 'noticeMsg',
  timetable: 'timetableMsg',
};

function handleEditClick(event, button) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const entity = button?.dataset?.entity;
  if (!entity) return;

  if (!canEditEntity(entity)) {
    const msgTarget = EDIT_MESSAGE_TARGET[entity] || 'authMsg';
    setMessage(msgTarget, 'Edit permission available nahi hai.', 'error');
    return;
  }

  const row = decodeRowPayload(button);
  if (!row) {
    const msgTarget = EDIT_MESSAGE_TARGET[entity] || 'authMsg';
    setMessage(msgTarget, 'Edit data load nahi hui.', 'error');
    return;
  }

  const handler = EDIT_HANDLERS[entity];
  if (handler) handler(row);
}

function handleDeleteClick(event, button) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (!canDeleteEntity()) {
    setMessage('authMsg', 'Delete permission sirf Admin ko hai.', 'error');
    return;
  }

  const entity = button?.dataset?.entity;
  const id = button?.dataset?.id;
  if (!entity || !id) return;

  const label = button?.dataset?.label ? ` (${button.dataset.label})` : '';
  const readable = DELETE_ENTITY_LABELS[entity] || 'record';

  const confirmText = `Delete ${readable}${label}?`;
  if (!window.confirm(confirmText)) return;

  api(`/api/${entity}/${id}`, { method: 'DELETE' })
    .then(async () => {
      const msgTarget = DELETE_MESSAGE_TARGET[entity] || 'authMsg';
      setMessage(msgTarget, `${readable} delete ho gaya.`);
      await refreshData();
    })
    .catch((error) => {
      const msgTarget = DELETE_MESSAGE_TARGET[entity] || 'authMsg';
      setMessage(msgTarget, error.message, 'error');
    });
}
loadResultBtn.addEventListener('click', () => loadResultRecords().catch((error) => setMessage('resultMsg', error.message, 'error')));

async function boot() {
  setupPortalPages();
  setupControls();
  setupInstallPrompt();
  updateAccessUI();
  renderPublicNoticeWidgets([]);
  loadPublicNotices().catch(() => {});
  registerServiceWorker();

  if (!authToken) return;

  try {
    await refreshSessionToken();
    await refreshData();
    setPortalPage('portal');
  } catch (_error) {
    setAuth('', null);
  }
}

boot();



































