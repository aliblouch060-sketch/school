const CLASS_OPTIONS = ['Play Group', 'Nursery', 'Prep', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const loginForm = document.getElementById('loginForm');
const userForm = document.getElementById('userForm');
const logoutBtn = document.getElementById('logoutBtn');
const currentUserInput = document.getElementById('currentUser');
const authModeInput = document.getElementById('authMode');

const admissionForm = document.getElementById('admissionForm');
const attendanceForm = document.getElementById('attendanceForm');
const resultForm = document.getElementById('resultForm');
const resultTemplateForm = document.getElementById('resultTemplateForm');
const resultTemplateClass = document.getElementById('resultTemplateClass');
const resultTemplateLines = document.getElementById('resultTemplateLines');
const bulkResultForm = document.getElementById('bulkResultForm');
const bulkResultClass = document.getElementById('bulkResultClass');
const bulkResultStudent = document.getElementById('bulkResultStudent');
const bulkResultExamName = document.getElementById('bulkResultExamName');
const bulkResultRows = document.getElementById('bulkResultRows');
const feeForm = document.getElementById('feeForm');
const noticeForm = document.getElementById('noticeForm');
const timetableForm = document.getElementById('timetableForm');
const voucherForm = document.getElementById('voucherForm');
const saveVoucherBtn = document.getElementById('saveVoucherBtn');
const saveClassVoucherBtn = document.getElementById('saveClassVoucherBtn');
const printVoucherBtn = document.getElementById('printVoucherBtn');
const paperForm = document.getElementById('paperForm');
const paperClass = document.getElementById('paperClass');
const savePaperBtn = document.getElementById('savePaperBtn');
const printPaperBtn = document.getElementById('printPaperBtn');
const paperBodyInput = document.getElementById('paperBody');
const resultCardForm = document.getElementById('resultCardForm');
const resultCardClass = document.getElementById('resultCardClass');
const resultCardStudent = document.getElementById('resultCardStudent');
const resultCardExam = document.getElementById('resultCardExam');
const saveResultCardBtn = document.getElementById('saveResultCardBtn');
const printResultCardBtn = document.getElementById('printResultCardBtn');
const oneClickResultBtn = document.getElementById('oneClickResultBtn');
const saveRecordsBtn = document.getElementById('saveRecordsBtn');
const installAppBtn = document.getElementById('installAppBtn');
const classColumns = document.getElementById('classColumns');
const langToggleEn = document.getElementById('langToggleEn');
const langToggleUr = document.getElementById('langToggleUr');
const offlineBadge = document.getElementById('offlineBadge');

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
const defaulterClassFilter = document.getElementById('defaulterClassFilter');
const defaulterMonthFilter = document.getElementById('defaulterMonthFilter');
const loadDefaultersBtn = document.getElementById('loadDefaultersBtn');
const paidClassFilter = document.getElementById('paidClassFilter');
const paidMonthFilter = document.getElementById('paidMonthFilter');
const loadPaidFeesBtn = document.getElementById('loadPaidFeesBtn');
const expenseMonthFilter = document.getElementById('expenseMonthFilter');
const loadExpensesBtn = document.getElementById('loadExpensesBtn');
const bulkExpenseInput = document.getElementById('bulkExpenseInput');
const saveBulkExpensesBtn = document.getElementById('saveBulkExpensesBtn');
const absenceNotificationsToggle = document.getElementById('absenceNotificationsToggle');
const absenceNotificationStatus = document.getElementById('absenceNotificationStatus');
const feeTotalAmountInput = document.getElementById('feeTotalAmount');
const autoGenerateFeeBtn = document.getElementById('autoGenerateFeeBtn');

const extractFromPhotoBtn = document.getElementById('extractFromPhotoBtn');
const bFormPhotoInput = document.getElementById('bFormPhoto');

const studentsTableBody = document.querySelector('#studentsTable tbody');
const feesTableBody = document.querySelector('#feesTable tbody');
const defaultersTableBody = document.querySelector('#defaultersTable tbody');
const paidFeesTableBody = document.querySelector('#paidFeesTable tbody');
const expensesTableBody = document.querySelector('#expensesTable tbody');
const noticesTableBody = document.querySelector('#noticesTable tbody');
const timetableTableBody = document.querySelector('#timetableTable tbody');
const attendanceTableBody = document.querySelector('#attendanceTable tbody');
const resultsTableBody = document.querySelector('#resultsTable tbody');
const voucherPreview = document.getElementById('voucherPreview');
const resultCardPreview = document.getElementById('resultCardPreview');
const voucherPrintArea = document.getElementById('voucherPrintArea');
const paperPreview = document.getElementById('paperPreview');
const paperPrintArea = document.getElementById('paperPrintArea');
const summaryPaidTotal = document.getElementById('summaryPaidTotal');
const summaryDueTotal = document.getElementById('summaryDueTotal');
const summaryPaidCount = document.getElementById('summaryPaidCount');
const summaryDefaulterCount = document.getElementById('summaryDefaulterCount');
const summaryClassLabel = document.getElementById('summaryClassLabel');
const summaryMonthLabel = document.getElementById('summaryMonthLabel');
const incomeSummaryValue = document.getElementById('incomeSummaryValue');
const expenseSummaryValue = document.getElementById('expenseSummaryValue');
const netSummaryValue = document.getElementById('netSummaryValue');
const incomeSummaryMeta = document.getElementById('incomeSummaryMeta');
const expenseSummaryMeta = document.getElementById('expenseSummaryMeta');
const netSummaryMeta = document.getElementById('netSummaryMeta');
const allTimeExpenseValue = document.getElementById('allTimeExpenseValue');
const allTimeNetValue = document.getElementById('allTimeNetValue');
const allTimeExpenseMeta = document.getElementById('allTimeExpenseMeta');
const allTimeNetMeta = document.getElementById('allTimeNetMeta');
const syllabusTemplateForm = document.getElementById('syllabusTemplateForm');
const syllabusTemplateClass = document.getElementById('syllabusTemplateClass');
const syllabusTemplateTerm = document.getElementById('syllabusTemplateTerm');
const syllabusTemplateFields = document.getElementById('syllabusTemplateFields');
const syllabusForm = document.getElementById('syllabusForm');
const syllabusClass = document.getElementById('syllabusClass');
const syllabusStudent = document.getElementById('syllabusStudent');
const syllabusTerm = document.getElementById('syllabusTerm');
const saveSyllabusBtn = document.getElementById('saveSyllabusBtn');
const printSyllabusBtn = document.getElementById('printSyllabusBtn');
const syllabusPreview = document.getElementById('syllabusPreview');

const cancelAdmissionEditBtn = document.getElementById('cancelAdmissionEditBtn');
const cancelAttendanceEditBtn = document.getElementById('cancelAttendanceEditBtn');
const cancelResultEditBtn = document.getElementById('cancelResultEditBtn');
const cancelFeeEditBtn = document.getElementById('cancelFeeEditBtn');
const cancelNoticeEditBtn = document.getElementById('cancelNoticeEditBtn');
const cancelTimetableEditBtn = document.getElementById('cancelTimetableEditBtn');
const expenseForm = document.getElementById('expenseForm');
const portalPages = Array.from(document.querySelectorAll('[data-portal-page]'));
const portalPageButtons = Array.from(document.querySelectorAll('[data-portal-page-btn]'));
const publicNoticeList = document.getElementById('publicNoticeList');
const publicNoticeTickerTrack = document.getElementById('publicNoticeTickerTrack');
const i18nElements = {
  topStripLeft: document.getElementById('topStripLeft'),
  topStripRight: document.getElementById('topStripRight'),
  brandSubline: document.getElementById('brandSubline'),
  brandSub: document.getElementById('brandSub'),
  menuHome: document.getElementById('menuHome'),
  menuFeatures: document.getElementById('menuFeatures'),
  menuNotices: document.getElementById('menuNotices'),
  menuLogin: document.getElementById('menuLogin'),
  navPortalTitle: document.getElementById('navPortalTitle'),
  navModulesTitle: document.getElementById('navModulesTitle'),
  sideHome: document.getElementById('sideHome'),
  sideFeatures: document.getElementById('sideFeatures'),
  sideNotices: document.getElementById('sideNotices'),
  sideLogin: document.getElementById('sideLogin'),
  sideCardTitle: document.getElementById('sideCardTitle'),
  sideCardBody: document.getElementById('sideCardBody'),
  heroEyebrow: document.getElementById('heroEyebrow'),
  heroTitle: document.getElementById('heroTitle'),
  heroLead: document.getElementById('heroLead'),
  badgeAi: document.getElementById('badgeAi'),
  badgeUrdu: document.getElementById('badgeUrdu'),
  badgeMobile: document.getElementById('badgeMobile'),
  badgeSecure: document.getElementById('badgeSecure'),
  heroCtaPrimary: document.getElementById('heroCtaPrimary'),
  heroCtaSecondary: document.getElementById('heroCtaSecondary'),
  coreFeaturesTitle: document.getElementById('coreFeaturesTitle'),
  whyChooseTitle: document.getElementById('whyChooseTitle'),
};

let allStudents = [];
let allFees = [];
let resultSubjectTemplates = {};
let authToken = localStorage.getItem('sms_token') || '';
let authUser = null;
let currentVoucher = null;
let currentResultCard = null;
let currentSyllabus = null;
let currentPaper = null;
let deferredInstallPrompt = null;
let selectedWorkspaceClass = '';
const voucherAutoGeneratedKeys = new Set();
let tesseractLoadPromise = null;
let tokenRefreshTimer = null;
let activePortalPage = 'home';
let serviceWorkerReloadScheduled = false;
let absenceNotificationPollTimer = null;
let absenceNotificationsEnabled = false;
const hadServiceWorkerControllerAtLoad = 'serviceWorker' in navigator && Boolean(navigator.serviceWorker.controller);
const TOKEN_REFRESH_INTERVAL_MS = 6 * 60 * 60 * 1000;
const ABSENCE_POLL_INTERVAL_MS = 30 * 1000;
const ABSENCE_NOTIFICATION_SEEN_KEY = 'sms_absence_seen_ids';
const ABSENCE_NOTIFICATION_PREF_KEY = 'sms_absence_notifications_pref';
const LANGUAGE_KEY = 'sms_lang';
let lastSyllabusTerm = '';

const I18N_TEXT = {
  en: {
    topStripLeft: 'AI-Powered School Management',
    topStripRight: 'Bilingual + Mobile Ready',
    brandSubline: 'AI School Management System',
    brandSub: 'Admissions, Attendance, Results, Fees, Notices, Timetable and Smart Records',
    menuHome: 'Home',
    menuFeatures: 'Features',
    menuNotices: 'School Notices',
    menuLogin: 'Operations Login',
    menuLoginLoggedIn: 'Admin Workspace',
    navPortalTitle: 'Portal Pages',
    navModulesTitle: 'School Modules',
    sideHome: 'Portal Home',
    sideFeatures: 'Features',
    sideNotices: 'Notice Board',
    sideLogin: 'Operations Login',
    sideCardTitle: 'AI Ready',
    sideCardBody: 'Smart data entry, attendance insights, and bilingual workflows for fast daily operations.',
    heroEyebrow: 'AI-Enabled School Operations',
    heroTitle: 'Welcome to The Scholar Kids Staff Portal',
    heroLead:
      'Teachers aur school staff yahan se login karke admissions, attendance, results, fees, notices aur timetable ka kaam mobile ya computer dono par kar sakte hain. Smart tools aap ke daily tasks ko tez aur accurate banate hain.',
    badgeAi: 'AI Assisted Entries',
    badgeUrdu: 'Urdu + English Friendly',
    badgeMobile: 'Mobile Ready',
    badgeSecure: 'Secure Records',
    heroCtaPrimary: 'Open Operations Login',
    heroCtaSecondary: 'View School Notices',
    coreFeaturesTitle: 'Core Features',
    whyChooseTitle: 'Why Schools Choose Us',
  },
  ur: {
    topStripLeft: 'اے آئی پاورڈ اسکول مینجمنٹ',
    topStripRight: 'دو لسانی + موبائل ریڈی',
    brandSubline: 'اے آئی اسکول مینجمنٹ سسٹم',
    brandSub: 'ایڈمشن، حاضری، نتائج، فیس، نوٹس، ٹائم ٹیبل اور اسمارٹ ریکارڈز',
    menuHome: 'ہوم',
    menuFeatures: 'خصوصیات',
    menuNotices: 'اسکول نوٹس',
    menuLogin: 'آپریشنز لاگ اِن',
    menuLoginLoggedIn: 'ایڈمن ورک اسپیس',
    navPortalTitle: 'پورٹل صفحات',
    navModulesTitle: 'اسکول ماڈیولز',
    sideHome: 'پورٹل ہوم',
    sideFeatures: 'خصوصیات',
    sideNotices: 'نوٹس بورڈ',
    sideLogin: 'آپریشنز لاگ اِن',
    sideCardTitle: 'اے آئی ریڈی',
    sideCardBody: 'اسمارٹ ڈیٹا انٹری، حاضری ان سائیٹس اور دو لسانی ورک فلو برائے تیز آپریشنز۔',
    heroEyebrow: 'اے آئی فعال اسکول آپریشنز',
    heroTitle: 'اسکالر کڈز اسٹاف پورٹل میں خوش آمدید',
    heroLead:
      'اساتذہ اور اسٹاف یہاں لاگ اِن کر کے ایڈمشن، حاضری، نتائج، فیس، نوٹس اور ٹائم ٹیبل کا کام موبائل یا کمپیوٹر پر کر سکتے ہیں۔ اسمارٹ ٹولز آپ کے روزمرہ کام کو تیز اور درست بناتے ہیں۔',
    badgeAi: 'اے آئی اسسٹڈ انٹریز',
    badgeUrdu: 'اردو + انگلش فرینڈلی',
    badgeMobile: 'موبائل ریڈی',
    badgeSecure: 'محفوظ ریکارڈز',
    heroCtaPrimary: 'آپریشنز لاگ اِن کھولیں',
    heroCtaSecondary: 'اسکول نوٹس دیکھیں',
    coreFeaturesTitle: 'اہم خصوصیات',
    whyChooseTitle: 'اسکول ہمیں کیوں چنتے ہیں',
  },
};

function setMessage(id, message, type = 'success') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className = `msg ${type}`;
}

function applyLanguage(lang) {
  const chosen = I18N_TEXT[lang] ? lang : 'en';
  const strings = I18N_TEXT[chosen];

  Object.entries(i18nElements).forEach(([key, el]) => {
    if (!el || !strings[key]) return;
    el.textContent = strings[key];
  });

  document.body.classList.toggle('lang-ur', chosen === 'ur');
  document.documentElement.lang = chosen === 'ur' ? 'ur' : 'en';
  document.documentElement.dir = chosen === 'ur' ? 'rtl' : 'ltr';

  if (langToggleEn && langToggleUr) {
    langToggleEn.classList.toggle('is-active', chosen === 'en');
    langToggleUr.classList.toggle('is-active', chosen === 'ur');
  }

  localStorage.setItem(LANGUAGE_KEY, chosen);
}

function getCurrentLanguage() {
  return localStorage.getItem(LANGUAGE_KEY) || 'en';
}

function t(key) {
  const lang = getCurrentLanguage();
  return I18N_TEXT[lang]?.[key] || I18N_TEXT.en?.[key] || '';
}

function updateOfflineBadge() {
  if (!offlineBadge) return;
  offlineBadge.hidden = navigator.onLine;
}

function cacheKeyForUrl(url) {
  return `sms_api_cache_${encodeURIComponent(url)}`;
}

function readCachedApi(url) {
  try {
    const raw = localStorage.getItem(cacheKeyForUrl(url));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

function writeCachedApi(url, data) {
  try {
    const payload = { data, ts: Date.now() };
    localStorage.setItem(cacheKeyForUrl(url), JSON.stringify(payload));
  } catch (_error) {
    // Ignore cache write issues.
  }
}

function getFormData(form) {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
}

function setFeeTotalManualFlag(isManual) {
  if (!feeTotalAmountInput) return;
  feeTotalAmountInput.dataset.manual = isManual ? '1' : '0';
}

function isFeeTotalManual() {
  return feeTotalAmountInput?.dataset.manual === '1';
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

function getTodayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function isAbsenceNotificationsEnabled() {
  return Boolean(absenceNotificationsEnabled);
}

function saveAbsenceNotificationPreference(enabled) {
  try {
    localStorage.setItem(ABSENCE_NOTIFICATION_PREF_KEY, enabled ? '1' : '0');
  } catch (_error) {
    // Ignore local storage write issues.
  }
}

function loadAbsenceNotificationPreference() {
  try {
    return localStorage.getItem(ABSENCE_NOTIFICATION_PREF_KEY) === '1';
  } catch (_error) {
    return false;
  }
}

function readSeenAbsenceState() {
  try {
    const raw = localStorage.getItem(ABSENCE_NOTIFICATION_SEEN_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && parsed.date === getTodayDateKey() && Array.isArray(parsed.ids)) {
      return parsed;
    }
  } catch (_error) {
    // Ignore invalid local storage state.
  }

  return { date: getTodayDateKey(), ids: [] };
}

function writeSeenAbsenceState(ids) {
  localStorage.setItem(
    ABSENCE_NOTIFICATION_SEEN_KEY,
    JSON.stringify({ date: getTodayDateKey(), ids: Array.from(new Set(ids.map((id) => String(id)))) })
  );
}

function markAbsenceAsSeen(id) {
  const state = readSeenAbsenceState();
  state.ids.push(String(id));
  writeSeenAbsenceState(state.ids);
}

function supportsPushNotifications() {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`.replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
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
        .map((notice) => `
          <li>
            <strong>${escapeHtml(notice.publish_date)} - ${escapeHtml(notice.title)}</strong>
            <span>${escapeHtml(notice.audience)}</span>
            <p>${escapeHtml(notice.body || 'No details added yet.')}</p>
          </li>
        `)
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
      button.textContent = isLoggedIn ? t('menuLoginLoggedIn') : t('menuLogin') || 'Staff Login';
    } else {
      button.textContent = isLoggedIn ? t('menuLoginLoggedIn') : t('menuLogin') || 'Staff Login';
    }
  });

  updateAbsenceNotificationUI();
}

async function api(url, options = {}) {
  const { suppressAuthError = false, ...requestOptions } = options;
  const headers = {
    'Content-Type': 'application/json',
    ...(requestOptions.headers || {}),
  };
  const method = String(requestOptions.method || 'GET').toUpperCase();

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  if (!navigator.onLine && method !== 'GET') {
    throw new Error('Offline mode: changes sync nahi ho sakti. Internet on kar ke dobara try karein.');
  }

  let response;
  let rawBody = '';

  try {
    response = await fetch(url, { ...requestOptions, headers });
    rawBody = await response.text();
  } catch (error) {
    if (method === 'GET') {
      const cached = readCachedApi(url);
      if (cached?.data != null) return cached.data;
    }
    throw new Error('Network error. Internet check karein.');
  }
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

  if (method === 'GET') {
    writeCachedApi(url, data);
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
  setClassOnSelect(syllabusClass, className);
  setClassOnSelect(syllabusTemplateClass, className);

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

async function getActiveServiceWorkerRegistration() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service worker support available nahi hai.');
  }

  return navigator.serviceWorker.ready;
}

async function subscribeCurrentDeviceToPush() {
  if (!supportsPushNotifications()) {
    return { ok: false, reason: 'unsupported' };
  }

  const permission = Notification.permission === 'default'
    ? await Notification.requestPermission()
    : Notification.permission;

  if (permission !== 'granted') {
    return { ok: false, reason: 'permission-denied' };
  }

  const registration = await getActiveServiceWorkerRegistration();
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    const data = await api('/api/push/vapid-public-key');
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(String(data.publicKey || '')),
    });
  }

  await api('/api/push/subscribe', {
    method: 'POST',
    body: JSON.stringify({ subscription }),
  });

  return { ok: true, subscription };
}

async function unsubscribeCurrentDeviceFromPush() {
  if (!supportsPushNotifications()) return;

  const registration = await getActiveServiceWorkerRegistration();
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  await api('/api/push/unsubscribe', {
    method: 'POST',
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  });
  await subscription.unsubscribe().catch(() => {});
}

function stopAbsenceNotificationPolling() {
  if (absenceNotificationPollTimer) {
    clearInterval(absenceNotificationPollTimer);
    absenceNotificationPollTimer = null;
  }
}

async function loadAbsenceNotificationSettings() {
  if (!authUser || authUser.role !== 'Admin') {
    absenceNotificationsEnabled = false;
    saveAbsenceNotificationPreference(false);
    return;
  }

  const data = await api('/api/settings/absence-notifications');
  absenceNotificationsEnabled = Boolean(data?.enabled);
  saveAbsenceNotificationPreference(absenceNotificationsEnabled);
}

function updateAbsenceNotificationStatus(message) {
  if (absenceNotificationStatus) {
    absenceNotificationStatus.textContent = message;
  }
}

function updateAbsenceNotificationUI() {
  const isAdmin = Boolean(authUser && authUser.role === 'Admin');
  const enabled = isAdmin && isAbsenceNotificationsEnabled();

  if (absenceNotificationsToggle) {
    absenceNotificationsToggle.checked = enabled;
    absenceNotificationsToggle.disabled = !isAdmin;
  }

  if (!isAdmin) {
    updateAbsenceNotificationStatus('Only admin can use absent student notifications.');
    stopAbsenceNotificationPolling();
    return;
  }

  if (!enabled) {
    updateAbsenceNotificationStatus('Off. Turn on to get absent alerts on PC and subscribed mobiles.');
    stopAbsenceNotificationPolling();
    return;
  }

  if (!('Notification' in window)) {
    updateAbsenceNotificationStatus('Server popup is on. This browser cannot show direct notifications.');
    stopAbsenceNotificationPolling();
    return;
  }

  if (Notification.permission === 'granted') {
    if (supportsPushNotifications()) {
      updateAbsenceNotificationStatus('On. Browser, mobile push, aur server alerts active hain.');
    } else {
      updateAbsenceNotificationStatus('On. Browser and server alerts active hain.');
    }
    return;
  }

  if (Notification.permission === 'denied') {
    updateAbsenceNotificationStatus('Server popup on hai. Browser/mobile permission blocked hai.');
    stopAbsenceNotificationPolling();
    return;
  }

  updateAbsenceNotificationStatus('Toggle on hai. Browser/mobile permission allow karein for push alerts.');
}

async function showAbsenceNotification(row) {
  if (!row || !('Notification' in window) || Notification.permission !== 'granted') return;

  const classLabel = `${row.class_name || '-'}${row.section ? `-${row.section}` : ''}`;
  const body = `${row.full_name || 'Student'} from class ${classLabel} is absent on ${row.attendance_date || getTodayDateKey()}.`;

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.showNotification('Student Absent Alert', {
          body,
          tag: `absence-${row.id}`,
          badge: '/icon-192.png',
          icon: '/icon-192.png',
        });
        return;
      }
    } catch (_error) {
      // Fall back to Notification below.
    }
  }

  new Notification('Student Absent Alert', {
    body,
    tag: `absence-${row.id}`,
    icon: '/icon-192.png',
  });
}

async function syncAbsentNotifications({ notifyNew = false } = {}) {
  if (!authUser || authUser.role !== 'Admin' || !isAbsenceNotificationsEnabled()) return;

  const today = getTodayDateKey();
  const rows = await api(`/api/attendance?attendanceDate=${today}`);
  const absentRows = Array.isArray(rows) ? rows.filter((row) => row.status === 'Absent' && row.id) : [];
  const seenState = readSeenAbsenceState();
  const seen = new Set(seenState.ids.map((id) => String(id)));

  for (const row of absentRows) {
    const rowId = String(row.id);
    if (seen.has(rowId)) continue;
    seen.add(rowId);
    if (notifyNew) {
      await showAbsenceNotification(row);
    }
  }

  writeSeenAbsenceState(Array.from(seen));
}

async function startAbsenceNotificationPolling() {
  stopAbsenceNotificationPolling();
  if (!authUser || authUser.role !== 'Admin' || !isAbsenceNotificationsEnabled()) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  await syncAbsentNotifications({ notifyNew: false });
  absenceNotificationPollTimer = setInterval(() => {
    syncAbsentNotifications({ notifyNew: true }).catch(() => {});
  }, ABSENCE_POLL_INTERVAL_MS);
}

async function setAbsenceNotificationsEnabled(enabled) {
  if (!authUser || authUser.role !== 'Admin') return;

  if (!enabled) {
    await unsubscribeCurrentDeviceFromPush().catch(() => {});
    await api('/api/settings/absence-notifications', {
      method: 'PUT',
      body: JSON.stringify({ enabled: false }),
    });
    absenceNotificationsEnabled = false;
    saveAbsenceNotificationPreference(false);
    updateAbsenceNotificationUI();
    return;
  }

  await api('/api/settings/absence-notifications', {
    method: 'PUT',
    body: JSON.stringify({ enabled: true }),
  });
  absenceNotificationsEnabled = true;
  saveAbsenceNotificationPreference(true);

  let subscriptionResult = { ok: false, reason: 'unsupported' };
  try {
    subscriptionResult = await subscribeCurrentDeviceToPush();
  } catch (_error) {
    subscriptionResult = { ok: false, reason: 'failed' };
  }

  writeSeenAbsenceState([]);
  updateAbsenceNotificationUI();
  await startAbsenceNotificationPolling();

  if (subscriptionResult.ok) {
    setMessage('attendanceMsg', 'Absent notifications on ho gayi hain. Is device par mobile/browser push subscribe ho gaya.');
    return;
  }

  if (subscriptionResult.reason === 'permission-denied') {
    setMessage('attendanceMsg', 'Toggle on ho gaya, lekin browser/mobile notification permission allow karni hogi.', 'error');
    return;
  }

  if (subscriptionResult.reason === 'unsupported') {
    setMessage('attendanceMsg', 'Toggle on ho gaya. Is device par push support nahi mila, lekin server-side alerts active hain.');
    return;
  }

  setMessage('attendanceMsg', 'Toggle on ho gaya, lekin is device ki push subscription complete nahi hui.', 'error');
}

function setupControls() {
  fillClassSelect(admissionForm?.elements.className);
  fillClassSelect(attendanceClass);
  fillClassSelect(resultClass);
  fillClassSelect(resultTemplateClass);
  fillClassSelect(bulkResultClass);
  fillClassSelect(feeClass);
  fillClassSelect(timetableForm?.elements.className);
  fillClassSelect(voucherClass);
  fillClassSelect(paperClass);
  fillClassSelect(resultCardClass);
  fillClassSelect(syllabusTemplateClass);
  fillClassSelect(syllabusClass);

  fillClassSelect(studentClassFilter, 'All Classes (Students)');
  fillClassSelect(feeClassFilter, 'All Classes (Fees)');
  fillClassSelect(attendanceClassFilter, 'All Classes (Attendance)');
  fillClassSelect(resultClassFilter, 'All Classes (Results)');
  fillClassSelect(defaulterClassFilter, 'All Classes (Defaulters)');
  fillClassSelect(paidClassFilter, 'All Classes (Paid)');

  attendanceDateFilter.value = new Date().toISOString().slice(0, 10);
  const currentMonth = new Date().toISOString().slice(0, 7);
  if (!voucherForm.elements.feeMonth?.value) {
    voucherForm.elements.feeMonth.value = currentMonth;
  }
  if (defaulterMonthFilter && !defaulterMonthFilter.value) {
    defaulterMonthFilter.value = currentMonth;
  }
  if (paidMonthFilter && !paidMonthFilter.value) {
    paidMonthFilter.value = currentMonth;
  }
  if (expenseMonthFilter && !expenseMonthFilter.value) {
    expenseMonthFilter.value = currentMonth;
  }
  if (paidClassFilter && defaulterClassFilter && paidClassFilter.value !== defaulterClassFilter.value) {
    paidClassFilter.value = defaulterClassFilter.value;
  }
  if (paidMonthFilter && defaulterMonthFilter && paidMonthFilter.value !== defaulterMonthFilter.value) {
    paidMonthFilter.value = defaulterMonthFilter.value;
  }
  if (bulkResultRows) {
    bulkResultRows.innerHTML = '<div class="bulk-result-empty">Class select karein taa ke subject rows nazar aayen.</div>';
  }
  renderClassColumns();

  if (expenseForm?.elements.expenseDate && !expenseForm.elements.expenseDate.value) {
    expenseForm.elements.expenseDate.value = new Date().toISOString().slice(0, 10);
  }

  if (syllabusTerm && !syllabusTerm.value) {
    syllabusTerm.value = 'Term 1';
    lastSyllabusTerm = syllabusTerm.value;
  }
  if (syllabusTemplateTerm && !syllabusTemplateTerm.value) {
    syllabusTemplateTerm.value = 'Term 1';
  }

  if (langToggleEn && langToggleUr) {
    langToggleEn.addEventListener('click', () => applyLanguage('en'));
    langToggleUr.addEventListener('click', () => applyLanguage('ur'));
  }

  const storedLang = localStorage.getItem(LANGUAGE_KEY) || 'en';
  applyLanguage(storedLang);

  updateOfflineBadge();
  window.addEventListener('online', updateOfflineBadge);
  window.addEventListener('offline', updateOfflineBadge);
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

function renderExamOptions(selectEl, exams, placeholder = 'Select Exam') {
  if (!selectEl) return;
  selectEl.innerHTML = `<option value="">${placeholder}</option>`;
  exams.forEach((examName) => {
    const option = document.createElement('option');
    option.value = examName;
    option.textContent = examName;
    selectEl.appendChild(option);
  });
}

function templateKeyForClass(className) {
  return String(className || '').trim().toLowerCase();
}

function getSubjectTemplateForClass(className) {
  return resultSubjectTemplates[templateKeyForClass(className)] || [];
}

async function loadSubjectTemplateForClass(className) {
  if (!className) return [];
  const normalizedKey = templateKeyForClass(className);
  const rows = await api(`/api/result-subjects?className=${encodeURIComponent(className)}`);
  resultSubjectTemplates[normalizedKey] = rows.map((row) => ({
    subjectName: row.subject_name,
    maxMarks: Number(row.max_marks || 100),
    sortOrder: Number(row.sort_order || 0),
  }));
  return resultSubjectTemplates[normalizedKey];
}

function parseSubjectTemplateLines(rawValue) {
  return String(rawValue || '')
    .split(/\r?\n/)
    .map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      const [subjectNamePart, maxMarksPart] = trimmed.split('|');
      const subjectName = String(subjectNamePart || '').trim();
      const maxMarks = maxMarksPart == null || String(maxMarksPart).trim() === '' ? 100 : Number(maxMarksPart);
      if (!subjectName || Number.isNaN(maxMarks) || maxMarks <= 0) return null;
      return { subjectName, maxMarks, sortOrder: index };
    })
    .filter(Boolean);
}

function renderSyllabusTemplateFields(subjects) {
  if (!syllabusTemplateFields) return;
  syllabusTemplateFields.innerHTML = '';
  if (!Array.isArray(subjects) || !subjects.length) {
    syllabusTemplateFields.innerHTML = '<div class="muted">Subjects load nahi huay.</div>';
    return;
  }

  subjects.forEach((item, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'syllabus-field';

    const label = document.createElement('label');
    label.textContent = `${item.subjectName || `Subject ${index + 1}`}`;

    const textarea = document.createElement('textarea');
    textarea.dataset.subject = item.subjectName || '';
    textarea.placeholder = 'Syllabus / Outline yahan likhein';
    textarea.value = item.details || '';

    wrapper.appendChild(label);
    wrapper.appendChild(textarea);
    syllabusTemplateFields.appendChild(wrapper);
  });
}

function readSyllabusTemplateFields() {
  if (!syllabusTemplateFields) return [];
  const fields = Array.from(syllabusTemplateFields.querySelectorAll('textarea'));
  return fields
    .map((field, index) => ({
      subjectName: String(field.dataset.subject || '').trim(),
      details: String(field.value || '').trim(),
      sortOrder: index,
    }))
    .filter((item) => item.subjectName);
}

async function loadSyllabusTemplateForClassTerm(className, termName) {
  if (!className || !termName) return [];
  const params = new URLSearchParams({ className, termName });
  const rows = await api(`/api/syllabus-templates?${params.toString()}`);
  return Array.isArray(rows)
    ? rows.map((row) => ({
        subjectName: row.subject_name,
        details: row.details || '',
        sortOrder: Number(row.sort_order || 0),
      }))
    : [];
}

async function syncSyllabusTemplateEditor(className, termName) {
  if (!className || !termName) {
    if (syllabusTemplateFields) syllabusTemplateFields.innerHTML = '';
    return;
  }

  const subjects = await loadSyllabusTemplateForClassTerm(className, termName);
  const hasGeneralRow = subjects.some((item) => String(item.subjectName || '').toLowerCase() === 'general');
  if (hasGeneralRow) {
    const resultSubjects = await loadSubjectTemplateForClass(className);
    if (Array.isArray(resultSubjects) && resultSubjects.length) {
      const detailsBySubject = new Map(
        subjects.map((item) => [String(item.subjectName || '').toLowerCase(), item.details || ''])
      );
      const mapped = resultSubjects.map((resultItem, index) => ({
        subjectName: resultItem.subjectName,
        details: detailsBySubject.get(String(resultItem.subjectName || '').toLowerCase()) || '',
        sortOrder: index,
      }));
      await api('/api/syllabus-templates', {
        method: 'POST',
        body: JSON.stringify({ className, termName, subjects: mapped }),
      });
      const refreshed = await loadSyllabusTemplateForClassTerm(className, termName);
      renderSyllabusTemplateFields(refreshed);
      return;
    }
  }
  if (!syllabusTemplateFields) return;

  const resultSubjects = await loadSubjectTemplateForClass(className);
  if (Array.isArray(resultSubjects) && resultSubjects.length) {
    const detailsBySubject = new Map(
      subjects.map((item) => [String(item.subjectName || '').toLowerCase(), item.details || ''])
    );
    const merged = resultSubjects.map((item, index) => ({
      subjectName: item.subjectName,
      details: detailsBySubject.get(String(item.subjectName || '').toLowerCase()) || '',
      sortOrder: index,
    }));
    renderSyllabusTemplateFields(merged);
    if (!subjects.length) {
      setMessage('syllabusTemplateMsg', 'Result subjects se syllabus auto-fill ho gaya. Ab topics add karke Save karein.');
    }
    return;
  }

  renderSyllabusTemplateFields(subjects);
}

function renderBulkResultRows(className) {
  const subjects = getSubjectTemplateForClass(className);
  if (!subjects.length) {
    bulkResultRows.innerHTML = '<div class="bulk-result-empty">Is class ke subjects abhi save nahi hue. Pehle upar Class Subject Setup mein subjects save karein.</div>';
    return;
  }

  bulkResultRows.innerHTML = subjects
    .map(
      (item, index) => `
        <div class="bulk-result-row" data-subject-index="${index}">
          <div>
            <strong>${escapeHtml(item.subjectName)}</strong>
            <input type="hidden" name="subjectName" value="${escapeHtml(item.subjectName)}" />
          </div>
          <input type="number" name="maxMarks" value="${escapeHtml(item.maxMarks)}" min="1" placeholder="Max Marks" required />
          <input type="number" name="obtainedMarks" min="0" placeholder="Obtained Marks" required />
          <input type="text" name="remarks" placeholder="Remarks (optional)" />
        </div>`
    )
    .join('');
}

async function syncResultTemplateEditor(className) {
  if (!className) {
    resultTemplateLines.value = '';
    return;
  }

  const subjects = await loadSubjectTemplateForClass(className);
  resultTemplateLines.value = subjects.map((item) => `${item.subjectName}|${item.maxMarks}`).join('\n');
}

async function syncBulkResultRows(className) {
  if (!className) {
    bulkResultRows.innerHTML = '<div class="bulk-result-empty">Class select karein taa ke subject rows nazar aayen.</div>';
    return;
  }

  await loadSubjectTemplateForClass(className);
  renderBulkResultRows(className);
}

function populateStudentSelects() {
  if (attendanceStudent && attendanceClass) {
    renderStudentOptions(attendanceStudent, getStudentsByClass(attendanceClass.value), attendanceClass.value ? 'Select Student' : 'Select Class First');
  }
  if (resultStudent && resultClass) {
    renderStudentOptions(resultStudent, getStudentsByClass(resultClass.value), resultClass.value ? 'Select Student' : 'Select Class First');
  }
  if (bulkResultStudent && bulkResultClass) {
    renderStudentOptions(bulkResultStudent, getStudentsByClass(bulkResultClass.value), bulkResultClass.value ? 'Select Student' : 'Select Class First');
  }
  if (feeStudent && feeClass) {
    renderStudentOptions(feeStudent, getStudentsByClass(feeClass.value), feeClass.value ? 'Select Student' : 'Select Class First');
  }
  if (voucherStudent && voucherClass) {
    renderStudentOptions(voucherStudent, getStudentsByClass(voucherClass.value), voucherClass.value ? 'Select Student' : 'Select Class First');
  }
  if (resultCardStudent && resultCardClass) {
    renderStudentOptions(resultCardStudent, getStudentsByClass(resultCardClass.value), resultCardClass.value ? 'Select Student' : 'Select Class First');
  }
  if (syllabusStudent && syllabusClass) {
    renderStudentOptions(syllabusStudent, getStudentsByClass(syllabusClass.value), syllabusClass.value ? 'Select Student' : 'Select Class First');
  }
  if (resultCardStudent && !resultCardStudent.value) {
    renderExamOptions(resultCardExam, [], 'Select Student First');
    clearResultCardPreview();
  }
  updateAutoFeePreview().catch(() => {
    // Ignore auto-preview failures during select refresh.
  });
}

async function updateAutoFeePreview() {
  if (!feeTotalAmountInput) return;

  const studentId = Number(feeStudent.value || 0);
  if (!studentId) {
    feeTotalAmountInput.value = '';
    setFeeTotalManualFlag(false);
    return;
  }

  if (isFeeTotalManual()) return;

  try {
    const data = await api(`/api/fees/calculate?studentId=${studentId}`);
    feeTotalAmountInput.value = Number(data.totalAmount || 0).toFixed(2);
    setFeeTotalManualFlag(false);
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

function renderDefaulters(rows) {
  if (!defaultersTableBody) return;
  defaultersTableBody.innerHTML = '';
  rows.slice(0, 30).forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.full_name}</td>
      <td>${row.class_name || '-'}${row.section ? `-${row.section}` : ''}</td>
      <td>${row.phone || '-'}</td>
      <td>${row.last_fee_month || '-'}</td>
      <td>Rs. ${Number(row.total_due || 0).toFixed(2)}</td>
    `;
    defaultersTableBody.appendChild(tr);
  });
}

function renderPaidFees(rows) {
  if (!paidFeesTableBody) return;
  paidFeesTableBody.innerHTML = '';
  rows.slice(0, 40).forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.full_name}</td>
      <td>${row.class_name || '-'}${row.section ? `-${row.section}` : ''}</td>
      <td>${row.fee_month}</td>
      <td>Rs. ${Number(row.paid_amount || 0).toFixed(2)}</td>
      <td>${row.payment_date || '-'}</td>
    `;
    paidFeesTableBody.appendChild(tr);
  });
}

let isSyncingFeeFilters = false;

function syncFeeFilters(source) {
  if (isSyncingFeeFilters) return;
  if (!paidClassFilter || !paidMonthFilter || !defaulterClassFilter || !defaulterMonthFilter) return;
  isSyncingFeeFilters = true;

  if (source === 'paid') {
    defaulterClassFilter.value = paidClassFilter.value;
    defaulterMonthFilter.value = paidMonthFilter.value;
  } else if (source === 'defaulter') {
    paidClassFilter.value = defaulterClassFilter.value;
    paidMonthFilter.value = defaulterMonthFilter.value;
  }

  isSyncingFeeFilters = false;
}

function getFeeSummaryParams() {
  const className = paidClassFilter?.value || defaulterClassFilter?.value || '';
  const feeMonth = paidMonthFilter?.value || defaulterMonthFilter?.value || '';
  return { className, feeMonth };
}

async function updateFeeSummary() {
  if (!authUser || authUser.role !== 'Admin') return;
  if (!summaryPaidTotal || !summaryDueTotal) return;

  const { className, feeMonth } = getFeeSummaryParams();
  const params = new URLSearchParams();
  if (className) params.set('className', className);
  if (feeMonth) params.set('feeMonth', feeMonth);

  const data = await api(`/api/fees/summary?${params.toString()}`);
  const paidTotal = Number(data.totalPaid || 0);
  const dueTotal = Number(data.totalDue || 0);
  const paidCount = Number(data.paidCount || 0);
  const defaulterCount = Number(data.defaulterCount || 0);

  summaryPaidTotal.textContent = `Rs. ${formatMoney(paidTotal)}`;
  summaryDueTotal.textContent = `Rs. ${formatMoney(dueTotal)}`;
  if (summaryPaidCount) summaryPaidCount.textContent = `${paidCount} paid records`;
  if (summaryDefaulterCount) summaryDefaulterCount.textContent = `${defaulterCount} defaulters`;
  if (summaryClassLabel) summaryClassLabel.textContent = className || 'All Classes';
  if (summaryMonthLabel) summaryMonthLabel.textContent = `Month: ${feeMonth || '-'}`;
}

function renderAttendanceStatusBadge(status) {
  const value = String(status || '').trim() || '-';
  const key = value.toLowerCase();
  return `<span class="status-pill status-${escapeHtml(key)}">${escapeHtml(value)}</span>`;
}

function renderAttendance(rows) {
  attendanceTableBody.innerHTML = '';
  rows.slice(0, 40).forEach((item) => {
    const tr = document.createElement('tr');
    const statusKey = String(item.status || '').trim().toLowerCase();
    tr.className = `attendance-row${statusKey ? ` status-${statusKey}` : ''}`;
    tr.innerHTML = `
      <td>${item.attendance_date}</td>
      <td>${item.class_name}</td>
      <td>${item.full_name}</td>
      <td>${renderAttendanceStatusBadge(item.status)}</td>
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
    tr.innerHTML = `
      <td>${escapeHtml(notice.publish_date)}</td>
      <td>${escapeHtml(notice.title)}</td>
      <td>${escapeHtml(notice.body || '-')}</td>
      <td>${escapeHtml(notice.audience)}</td>
      ${renderActionCell('notices', notice, notice.title)}
    `;
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
  setFormValue(admissionForm, 'feeDiscount', row.fee_discount ?? 0);
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
    setFeeTotalManualFlag(true);
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
  if (!canEdit && !canDelete && entity !== 'students') return '<td>-</td>';

  const safeLabel = escapeHtml(label || '');
  const itemId = item && item.id ? item.id : '';
  const rowData = encodeURIComponent(JSON.stringify(item || {}));
  const editBtn = canEdit
    ? `<button type="button" class="action-btn edit-btn" data-entity="${entity}" data-id="${itemId}" data-label="${safeLabel}" data-row="${rowData}" onclick="handleEditClick(event, this)">Edit</button>`
    : '';
  const syllabusBtn = entity === 'students'
    ? `<button type="button" class="action-btn" data-entity="students" data-row="${rowData}" onclick="handleSyllabusQuickView(event, this)">Syllabus</button>`
    : '';
  const deleteBtn = canDelete
    ? `<button type="button" class="action-btn delete-btn" data-entity="${entity}" data-id="${itemId}" data-label="${safeLabel}" onclick="handleDeleteClick(event, this)">Delete</button>`
    : '';
  const spacer = (editBtn && (syllabusBtn || deleteBtn)) || (syllabusBtn && deleteBtn) ? ' ' : '';
  return `<td class="action-cell">${editBtn}${editBtn && syllabusBtn ? ' ' : ''}${syllabusBtn}${spacer}${deleteBtn}</td>`;
}

const VOUCHER_SCHOOL_PROFILE = {
  name: 'The Scholar Kids School',
  contact: '#03111652325',
  logoPath: 'ska-logo.svg',
};

const RESULT_CARD_SCHOOL_PROFILE = {
  name: 'The Scholar Kids School',
  contact: '#03111652325',
  campus: 'Academic Performance Record',
  logoPath: 'ska-logo.svg',
};

const SYLLABUS_SCHOOL_PROFILE = {
  name: 'The Scholar Kids School',
  contact: '#03111652325',
};

const PAPER_SCHOOL_PROFILE = {
  name: 'The Scholar Kids School',
  contact: '#03111652325',
  logoPath: 'ska-logo.svg',
};

function getSchoolLogoUrl() {
  return new URL(RESULT_CARD_SCHOOL_PROFILE.logoPath, window.location.href).href;
}

function computeOverallGrade(percentage) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
}

function getPerformanceLabel(percentage) {
  if (percentage >= 90) return 'Outstanding Performance';
  if (percentage >= 80) return 'Excellent Progress';
  if (percentage >= 70) return 'Very Good Progress';
  if (percentage >= 60) return 'Good Effort';
  if (percentage >= 50) return 'Satisfactory';
  return 'Needs Improvement';
}

function getOverallRemarks(percentage) {
  if (percentage >= 90) return 'Keep shining with the same consistency and discipline.';
  if (percentage >= 80) return 'Strong academic performance with excellent potential.';
  if (percentage >= 70) return 'Very nice work. A little more focus can raise the result further.';
  if (percentage >= 60) return 'Good effort. Regular revision will improve the next exam.';
  if (percentage >= 50) return 'Fair result. More practice is needed for stronger performance.';
  return 'Please focus on daily study, homework, and revision for improvement.';
}

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

function getPreviousMonthKey(feeMonth) {
  const value = String(feeMonth || '').trim();
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return '';
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  if (Number.isNaN(year) || Number.isNaN(monthIndex)) return '';
  const prev = new Date(year, monthIndex - 1, 1);
  return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
}

function calculatePreviousMonthDue(studentId, feeMonth) {
  const prevMonth = getPreviousMonthKey(feeMonth);
  if (!prevMonth) return 0;
  return allFees
    .filter(
      (fee) => Number(fee.student_id) === Number(studentId) && String(fee.fee_month) === prevMonth
    )
    .reduce((total, fee) => total + Math.max(Number(fee.due_amount || 0), 0), 0);
}

function setVoucherActionsState(enabled) {
  const isEnabled = Boolean(enabled);
  saveVoucherBtn.disabled = !isEnabled;
  printVoucherBtn.disabled = !isEnabled;
}

function updateClassVoucherState() {
  if (!saveClassVoucherBtn) return;
  const payload = getFormData(voucherForm);
  const feeMonth = String(payload.feeMonth || '').trim();
  const className = String(payload.className || '').trim();
  saveClassVoucherBtn.disabled = !(feeMonth && className);
}

function clearVoucherPreview() {
  currentVoucher = null;
  voucherPreview.innerHTML = '';
  setVoucherActionsState(false);
}

function buildVoucherData(studentId, feeMonth, { requireFeeRecord = false } = {}) {
  const selectedStudent = allStudents.find((student) => Number(student.id) === Number(studentId));
  if (!selectedStudent) return null;

  const feeRecord = findVoucherFeeRecord(studentId, feeMonth);
  if (requireFeeRecord && !feeRecord) return null;

  const outstandingDue = calculateOutstandingDue(studentId);
  const currentDue = Number(feeRecord?.due_amount || 0);
  const previousMonthDue = calculatePreviousMonthDue(studentId, feeMonth);
  const olderOutstandingDue = Math.max(outstandingDue - currentDue - previousMonthDue, 0);
  const className = `${selectedStudent.class_name}${selectedStudent.section ? `-${selectedStudent.section}` : ''}`;
  const issueDate = new Date().toLocaleDateString();

  return {
    schoolName: VOUCHER_SCHOOL_PROFILE.name,
    schoolContact: VOUCHER_SCHOOL_PROFILE.contact,
    schoolLogo: getSchoolLogoUrl(),
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
    previousMonthDue,
    olderOutstandingDue,
    outstandingDue,
    payableNow: Math.max(outstandingDue, currentDue + previousMonthDue + olderOutstandingDue),
    paymentDate: feeRecord?.payment_date || '-',
    paymentMode: feeRecord?.payment_mode || '-',
    issueDate,
    generatedAt: new Date().toLocaleString(),
    hasFeeRecord: Boolean(feeRecord),
  };
}

function createVoucherFromSelection({ requireFeeRecord = false, silent = false } = {}) {
  const payload = getFormData(voucherForm);
  const studentId = Number(payload.studentId || 0);
  const feeMonth = String(payload.feeMonth || '').trim();

  if (!studentId || !feeMonth) {
    if (!silent) throw new Error('Class, student aur fee month select karein.');
    return null;
  }

  const data = buildVoucherData(studentId, feeMonth, { requireFeeRecord });
  if (!data) {
    if (!silent) throw new Error('Student record nahi mila.');
    return null;
  }
  if (requireFeeRecord && !data.hasFeeRecord) return null;

  currentVoucher = data;
  renderVoucher(currentVoucher);
  setVoucherActionsState(true);

  if (!silent) {
    setMessage(
      'voucherMsg',
      data.hasFeeRecord
        ? 'Professional voucher generate ho gaya.'
        : 'Voucher generate hua, lekin selected month ka fee record abhi nahi mila.'
    );
  }

  return currentVoucher;
}

async function ensureVoucherFeeMonthGenerated({ feeMonth, className }) {
  const month = String(feeMonth || '').trim();
  const klass = String(className || '').trim();
  if (!month || !klass) return false;

  const key = `${klass}|${month}`;
  if (voucherAutoGeneratedKeys.has(key)) return false;
  voucherAutoGeneratedKeys.add(key);

  try {
    await api('/api/fees/auto-generate', {
      method: 'POST',
      body: JSON.stringify({ feeMonth: month, className: klass }),
    });
    await refreshData();
    return true;
  } catch (_error) {
    return false;
  }
}

async function syncVoucherAutoGenerate() {
  updateClassVoucherState();
  const voucher = createVoucherFromSelection({ requireFeeRecord: true, silent: true });
  if (voucher) return;

  const payload = getFormData(voucherForm);
  const feeMonth = String(payload.feeMonth || '').trim();
  const className = String(payload.className || '').trim();
  const previousMonth = getPreviousMonthKey(feeMonth);

  let generated = false;
  if (previousMonth) {
    generated = (await ensureVoucherFeeMonthGenerated({ feeMonth: previousMonth, className })) || generated;
  }
  generated = (await ensureVoucherFeeMonthGenerated({ feeMonth, className })) || generated;

  if (generated) {
    const retry = createVoucherFromSelection({ requireFeeRecord: true, silent: true });
    if (retry) return;
  }

  clearVoucherPreview();
}

function buildVoucherMarkup(data) {
  return `
    <div class="voucher-card voucher-paper">
      <div class="voucher-header voucher-banner">
        <div class="voucher-school">
          <div class="voucher-logo">
            <img src="${escapeHtml(data.schoolLogo || getSchoolLogoUrl())}" alt="${escapeHtml(data.schoolName)} Logo" />
          </div>
          <div>
            <h3>${escapeHtml(data.schoolName)}</h3>
            <p>Professional School Fee Voucher</p>
          </div>
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
              <th>Previous Month Due</th>
              <td>Rs. ${formatMoney(data.previousMonthDue)}</td>
            </tr>
            <tr>
              <th>Older Outstanding Due</th>
              <td>Rs. ${formatMoney(data.olderOutstandingDue)}</td>
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
    .voucher-school { display: flex; align-items: center; gap: 12px; }
    .voucher-logo { width: 54px; height: 54px; border-radius: 12px; border: 1px solid #d5e3dc; background: #f5fbf8; display: grid; place-items: center; overflow: hidden; }
    .voucher-logo img { width: 44px; height: 44px; object-fit: contain; }
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
    .voucher-sheet { page-break-after: always; break-after: page; }
    .voucher-sheet.is-last { page-break-after: auto; break-after: auto; }
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

function buildVoucherBatchMarkup(vouchers) {
  return vouchers
    .map((data, index) => {
      const isLast = index === vouchers.length - 1;
      return `<div class="voucher-sheet${isLast ? ' is-last' : ''}">${buildVoucherMarkup(data)}</div>`;
    })
    .join('');
}

function buildVoucherBatchDocument(vouchers, title) {
  const safeTitle = String(title || 'Class Fee Vouchers').replace(/[^\w-]+/g, '_');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(safeTitle)}</title>
  <style>
    ${voucherDocumentStyles()}
  </style>
</head>
<body>
  ${buildVoucherBatchMarkup(vouchers)}
</body>
</html>`;
}

function printHtmlContent(html, title, { area = voucherPrintArea, messageId = 'voucherMsg' } = {}) {
  if (!html) return;
  if (!area) {
    if (messageId) {
      setMessage(messageId, 'Print area missing. Please refresh.', 'error');
    }
    return;
  }

  document.querySelectorAll('.print-area').forEach((el) => {
    if (el !== area) el.innerHTML = '';
  });

  const originalTitle = document.title;
  const safeTitle = String(title || 'voucher').replace(/[^\w-]+/g, '_');
  document.title = safeTitle;
  area.innerHTML = html;
  window.print();

  window.setTimeout(() => {
    area.innerHTML = '';
    document.title = originalTitle;
  }, 300);
}

function saveVoucherFile() {
  if (!currentVoucher) return;
  const title = `voucher_${currentVoucher.admissionNo || 'student'}_${currentVoucher.feeMonth}`;
  const html = buildVoucherMarkup(currentVoucher);
  printHtmlContent(html, title, { area: voucherPrintArea, messageId: 'voucherMsg' });
  setMessage('voucherMsg', 'Print dialog khul gaya hai. Save as PDF select karein.');
}

async function saveClassVoucherPdf() {
  const payload = getFormData(voucherForm);
  const feeMonth = String(payload.feeMonth || '').trim();
  const className = String(payload.className || '').trim();
  if (!feeMonth || !className) {
    setMessage('voucherMsg', 'Class aur fee month select karein.', 'error');
    return;
  }

  await ensureVoucherFeeMonthGenerated({ feeMonth, className });
  await refreshData();

  const classStudents = getStudentsByClass(className);
  const vouchers = classStudents
    .map((student) => buildVoucherData(student.id, feeMonth, { requireFeeRecord: true }))
    .filter((data) => data && data.hasFeeRecord);

  if (!vouchers.length) {
    setMessage('voucherMsg', 'Is class ke liye koi fee record nahi mila.', 'error');
    return;
  }

  const title = `class_${className}_vouchers_${feeMonth}`;
  const html = buildVoucherBatchMarkup(vouchers);
  printHtmlContent(html, title, { area: voucherPrintArea, messageId: 'voucherMsg' });
  setMessage('voucherMsg', 'Class vouchers ready. Save as PDF select karein.');
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

function setPaperActionsState(enabled) {
  const isEnabled = Boolean(enabled);
  if (savePaperBtn) savePaperBtn.disabled = !isEnabled;
  if (printPaperBtn) printPaperBtn.disabled = !isEnabled;
}

function clearPaperPreview() {
  currentPaper = null;
  if (paperPreview) paperPreview.innerHTML = '';
  setPaperActionsState(false);
}

function buildPaperData() {
  if (!paperForm) return null;
  const payload = getFormData(paperForm);
  const className = String(payload.className || '').trim();
  const paperTitle = String(payload.paperTitle || '').trim();
  const paperBody = String(payload.paperBody || '').trim();

  if (!paperTitle || !className || !paperBody) return null;

  return {
    schoolName: PAPER_SCHOOL_PROFILE.name,
    schoolContact: PAPER_SCHOOL_PROFILE.contact,
    schoolLogo: getSchoolLogoUrl(),
    paperTitle,
    className,
    subject: String(payload.subject || '').trim(),
    paperDate: String(payload.paperDate || '').trim(),
    duration: String(payload.duration || '').trim(),
    instructions: String(payload.instructions || '').trim(),
    body: paperBody,
    generatedAt: new Date().toLocaleString(),
  };
}

function buildPaperMarkup(data) {
  return `
    <div class="paper-card">
      <div class="paper-header">
        <div class="paper-brand">
          <div class="voucher-logo">
            <img src="${escapeHtml(data.schoolLogo || getSchoolLogoUrl())}" alt="${escapeHtml(data.schoolName)} Logo" />
          </div>
          <div>
            <h3>${escapeHtml(data.schoolName)}</h3>
            <p>${escapeHtml(data.paperTitle)}</p>
          </div>
        </div>
        <div class="paper-meta">
          <span><strong>Class:</strong> ${escapeHtml(data.className)}</span>
          ${data.subject ? `<span><strong>Subject:</strong> ${escapeHtml(data.subject)}</span>` : ''}
          ${data.paperDate ? `<span><strong>Date:</strong> ${escapeHtml(data.paperDate)}</span>` : ''}
          ${data.duration ? `<span><strong>Time:</strong> ${escapeHtml(data.duration)}</span>` : ''}
        </div>
      </div>
      <div class="paper-info">
        ${data.instructions ? `<p><strong>Instructions:</strong> ${escapeHtml(data.instructions)}</p>` : '<p><strong>Instructions:</strong> Follow the questions carefully.</p>'}
      </div>
      <div class="paper-body">${escapeHtml(data.body)}</div>
      <div class="paper-footer">Generated on ${escapeHtml(data.generatedAt)} | ${escapeHtml(data.schoolContact)}</div>
    </div>
  `;
}

function renderPaper(data) {
  if (!paperPreview) return;
  paperPreview.innerHTML = buildPaperMarkup(data);
}

function printPaperFile() {
  if (!currentPaper) return;
  const title = `paper_${currentPaper.className || 'class'}_${new Date().toISOString().slice(0, 10)}`;
  const html = buildPaperMarkup(currentPaper);
  printHtmlContent(html, title, { area: paperPrintArea, messageId: 'paperMsg' });
  setMessage('paperMsg', 'Print dialog khul gaya hai. Save as PDF select karein.');
}

function savePaperFile() {
  if (!currentPaper) return;
  const title = `paper_${currentPaper.className || 'class'}_${new Date().toISOString().slice(0, 10)}`;
  const html = buildPaperMarkup(currentPaper);
  printHtmlContent(html, title, { area: paperPrintArea, messageId: 'paperMsg' });
  setMessage('paperMsg', 'Print dialog khul gaya hai. Save as PDF select karein.');
}

function setSyllabusActionsState(enabled) {
  const isEnabled = Boolean(enabled);
  if (saveSyllabusBtn) saveSyllabusBtn.disabled = !isEnabled;
  if (printSyllabusBtn) printSyllabusBtn.disabled = !isEnabled;
}

function clearSyllabusPreview() {
  currentSyllabus = null;
  if (syllabusPreview) syllabusPreview.innerHTML = '';
  setSyllabusActionsState(false);
}

function buildSyllabusMarkup(data) {
  const subjectRows = data.subjects.length
    ? data.subjects
        .map(
          (item) => `
            <tr>
              <td>${escapeHtml(item.subject || '-')}</td>
              <td>${escapeHtml(item.details || '-')}</td>
            </tr>`
        )
        .join('')
    : `
        <tr>
          <td colspan="2">No syllabus saved for this term yet.</td>
        </tr>`;

  return `
    <div class="syllabus-card">
      <div class="syllabus-head">
        <div>
          <h3>${escapeHtml(data.schoolName)}</h3>
          <p><strong>Term:</strong> ${escapeHtml(data.termName)}</p>
          <p>${escapeHtml(data.schoolContact)}</p>
        </div>
        <div class="syllabus-meta">
          <p><strong>Issue Date:</strong> ${escapeHtml(data.issueDate)}</p>
          <p><strong>Generated:</strong> ${escapeHtml(data.generatedAt)}</p>
        </div>
      </div>

      <div class="syllabus-info-grid">
        <p><strong>Student Name:</strong> ${escapeHtml(data.studentName)}</p>
        <p><strong>Admission No:</strong> ${escapeHtml(data.admissionNo)}</p>
        <p><strong>Class:</strong> ${escapeHtml(data.className)}</p>
        <p><strong>Parent/Guardian:</strong> ${escapeHtml(data.parentName)}</p>
        <p><strong>B-Form No:</strong> ${escapeHtml(data.bFormNo)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
      </div>

      <table class="syllabus-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Topics / Outline</th>
          </tr>
        </thead>
        <tbody>
          ${subjectRows}
        </tbody>
      </table>
      <p class="syllabus-note">Generated for parents and student reference.</p>
    </div>
  `;
}

function syllabusDocumentStyles() {
  return `
    body { margin: 0; padding: 22px; background: #f4f7f5; font-family: Arial, sans-serif; color: #162f25; }
    .syllabus-card { border: 1px solid #c9d9d1; border-radius: 18px; background: #ffffff; padding: 18px; box-shadow: 0 14px 28px rgba(12, 70, 55, 0.08); }
    .syllabus-head { display: flex; justify-content: space-between; gap: 16px; border-bottom: 2px solid #d9e6df; padding-bottom: 12px; margin-bottom: 12px; }
    .syllabus-head h3 { margin: 0 0 6px; font-size: 22px; text-transform: uppercase; color: #0f4b3b; }
    .syllabus-head p { margin: 3px 0; color: #355a4d; }
    .syllabus-meta { min-width: 200px; border-radius: 12px; background: #f1f7f4; padding: 10px 12px; }
    .syllabus-meta p { margin: 4px 0; font-size: 13px; }
    .syllabus-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; margin-bottom: 14px; }
    .syllabus-info-grid p { margin: 0; font-size: 14px; }
    .syllabus-table { width: 100%; border-collapse: collapse; }
    .syllabus-table th, .syllabus-table td { border: 1px solid #d2e0d8; padding: 10px; text-align: left; font-size: 14px; }
    .syllabus-table th { background: #eef6f2; }
    .syllabus-note { margin-top: 12px; font-size: 13px; color: #4c6a5d; }
    @media print { body { background: #ffffff; padding: 0; } .syllabus-card { box-shadow: none; border-radius: 0; } }
  `;
}

function buildSyllabusDocument(data, title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <style>${syllabusDocumentStyles()}</style>
</head>
<body>
  ${buildSyllabusMarkup(data)}
</body>
</html>`;
}

function renderSyllabus(data) {
  if (!syllabusPreview) return;
  syllabusPreview.innerHTML = buildSyllabusMarkup(data);
}

async function generateSyllabus({ silent = false } = {}) {
  const studentId = Number(syllabusStudent?.value || 0);
  const termName = String(syllabusTerm?.value || '').trim();

  if (!studentId || !termName) {
    if (!silent) throw new Error('Class, student aur term name select karein.');
    clearSyllabusPreview();
    return null;
  }

  const data = await api(`/api/syllabus?studentId=${studentId}&termName=${encodeURIComponent(termName)}`);
  const student = data.student || {};
  const className = `${student.class_name || ''}${student.section ? `-${student.section}` : ''}`;

  currentSyllabus = {
    schoolName: SYLLABUS_SCHOOL_PROFILE.name,
    schoolContact: SYLLABUS_SCHOOL_PROFILE.contact,
    termName,
    issueDate: new Date().toLocaleDateString(),
    generatedAt: new Date().toLocaleString(),
    studentName: student.full_name || '-',
    admissionNo: student.admission_no || '-',
    parentName: student.parent_name || '-',
    className,
    bFormNo: student.b_form_no || '-',
    phone: student.phone || '-',
    subjects: (data.subjects || []).map((item) => ({
      subject: item.subject_name || '-',
      details: item.details || '',
    })),
  };

  renderSyllabus(currentSyllabus);
  setSyllabusActionsState(true);

  if (!silent) {
    setMessage(
      'syllabusMsg',
      currentSyllabus.subjects.length ? 'Syllabus generate ho gaya.' : 'Syllabus generate ho gaya, lekin is term ka data abhi save nahi.'
    );
  }

  return currentSyllabus;
}

function saveSyllabusFile() {
  if (!currentSyllabus) return;
  const doc = buildSyllabusDocument(currentSyllabus, 'Student Syllabus');
  const blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
  const safeTerm = String(currentSyllabus.termName || 'term').replace(/[^\w-]+/g, '_');
  const fileName = `syllabus_${currentSyllabus.admissionNo || 'student'}_${safeTerm}.html`;
  const link = document.createElement('a');
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
  setMessage('syllabusMsg', 'Syllabus file save ho gaya.');
}

function printSyllabusFile() {
  if (!currentSyllabus) return;

  const printWindow = window.open('', '_blank', 'width=960,height=720');
  if (!printWindow) {
    setMessage('syllabusMsg', 'Popup blocked hai. Browser mein popups allow karein.', 'error');
    return;
  }

  printWindow.document.write(buildSyllabusDocument(currentSyllabus, 'Print Syllabus'));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function setResultCardActionsState(enabled) {
  const isEnabled = Boolean(enabled);
  saveResultCardBtn.disabled = !isEnabled;
  printResultCardBtn.disabled = !isEnabled;
}

function clearResultCardPreview() {
  currentResultCard = null;
  resultCardPreview.innerHTML = '';
  setResultCardActionsState(false);
}

async function loadResultCardExamOptions(preferredExam = '') {
  const studentId = Number(resultCardStudent?.value || 0);
  if (!studentId) {
    renderExamOptions(resultCardExam, [], 'Select Student First');
    return;
  }

  const rows = await api(`/api/results?studentId=${studentId}`);
  const exams = Array.from(new Set(rows.map((row) => String(row.exam_name || '').trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  renderExamOptions(resultCardExam, exams, exams.length ? 'Select Exam' : 'No Exam Saved');

  if (preferredExam && exams.includes(preferredExam)) {
    resultCardExam.value = preferredExam;
  }
}

async function syncResultCardExamOptions(preferredExam = '') {
  try {
    await loadResultCardExamOptions(preferredExam);
    if (resultCardExam.value) {
      await generateResultCard({ silent: true });
    } else {
      clearResultCardPreview();
    }
  } catch (error) {
    clearResultCardPreview();
    setMessage('resultCardMsg', error.message, 'error');
  }
}

function buildResultCardMarkup(data) {
  const subjectRows = data.subjects
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.subject)}</td>
          <td>${escapeHtml(item.marksLabel)}</td>
          <td>${escapeHtml(item.grade)}</td>
          <td>${escapeHtml(item.remarks)}</td>
        </tr>`
    )
    .join('');

  return `
    <div class="result-card-shell">
      <div class="result-card-head">
        <div class="result-card-school">
          <div class="result-card-logo-wrap">
            <img src="${escapeHtml(data.logoUrl)}" alt="${escapeHtml(data.schoolName)}" class="result-card-logo" />
          </div>
          <div>
            <h3>${escapeHtml(data.schoolName)}</h3>
            <p class="result-card-tagline">Professional Student Result Card</p>
            <p class="result-card-subline">${escapeHtml(data.campus)} | Contact: ${escapeHtml(data.contact)}</p>
          </div>
        </div>
        <div class="result-card-meta">
          <p><strong>Exam:</strong> ${escapeHtml(data.examName)}</p>
          <p><strong>Issue Date:</strong> ${escapeHtml(data.issueDate)}</p>
          <p><strong>Generated:</strong> ${escapeHtml(data.generatedAt)}</p>
        </div>
      </div>

      <div class="result-card-body">
        <div class="result-card-stats">
          <div class="result-card-student">
            <div class="result-card-grid">
              <p><strong>Student Name:</strong> ${escapeHtml(data.studentName)}</p>
              <p><strong>Admission No:</strong> ${escapeHtml(data.admissionNo)}</p>
              <p><strong>Father/Guardian:</strong> ${escapeHtml(data.parentName)}</p>
              <p><strong>Class:</strong> ${escapeHtml(data.className)}</p>
              <p><strong>B-Form No:</strong> ${escapeHtml(data.bFormNo)}</p>
              <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
            </div>
          </div>
          <div class="result-card-summary">
            <p><strong>Total Marks:</strong> ${escapeHtml(data.totalMarksLabel)}</p>
            <p><strong>Percentage:</strong> ${escapeHtml(data.percentageLabel)}</p>
            <p><strong>Overall Grade:</strong> ${escapeHtml(data.overallGrade)}</p>
            <p><strong>Performance:</strong> ${escapeHtml(data.performanceLabel)}</p>
            <div class="badge-row">
              <span class="result-badge primary">${escapeHtml(data.passStatus)}</span>
              <span class="result-badge accent">${escapeHtml(data.subjectCountLabel)}</span>
            </div>
          </div>
        </div>

        <table class="result-card-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${subjectRows}
            <tr class="totals-row">
              <th>Total</th>
              <td>${escapeHtml(data.totalMarksLabel)}</td>
              <td>${escapeHtml(data.overallGrade)}</td>
              <td>${escapeHtml(data.overallRemarks)}</td>
            </tr>
          </tbody>
        </table>

        <p class="result-card-note">${escapeHtml(data.overallRemarks)}</p>

        <div class="result-card-footer">
          <div class="result-card-sign">Class Teacher</div>
          <div class="result-card-sign">Exam Incharge</div>
          <div class="result-card-sign">Principal Signature</div>
        </div>
      </div>
    </div>
  `;
}

function resultCardDocumentStyles() {
  return `
    body { margin: 0; padding: 24px; background: #eef4f1; font-family: Arial, sans-serif; color: #17352d; }
    .result-card-shell { border: 1px solid #b9cec4; border-radius: 20px; overflow: hidden; background: #fff; box-shadow: 0 16px 32px rgba(13, 69, 56, 0.08); }
    .result-card-head { display: flex; justify-content: space-between; gap: 18px; padding: 22px; background: linear-gradient(135deg, #0d5a4a 0%, #1e7a63 58%, #dceee6 58%, #f7fbf9 100%); color: #fff; }
    .result-card-school { display: flex; gap: 14px; align-items: center; }
    .result-card-logo-wrap { width: 72px; height: 72px; border-radius: 18px; background: rgba(255,255,255,0.14); display: grid; place-items: center; }
    .result-card-logo { width: 56px; height: 56px; object-fit: contain; }
    .result-card-school h3, .result-card-school p, .result-card-meta p, .result-card-grid p, .result-card-summary p, .result-card-note { margin: 0; }
    .result-card-school h3 { font-size: 24px; text-transform: uppercase; letter-spacing: 0.5px; }
    .result-card-tagline { margin-top: 4px; font-weight: 700; }
    .result-card-subline { margin-top: 6px; color: rgba(255,255,255,0.88); font-size: 14px; }
    .result-card-meta { min-width: 210px; padding: 14px 16px; border-radius: 16px; background: rgba(255,255,255,0.12); color: #f7fffb; }
    .result-card-meta p + p { margin-top: 7px; }
    .result-card-body { padding: 22px; }
    .result-card-stats { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 16px; margin-bottom: 18px; }
    .result-card-student, .result-card-summary { border: 1px solid #d4e1db; border-radius: 16px; padding: 16px; background: #fbfdfc; }
    .result-card-summary { background: linear-gradient(180deg, #f2f8f5 0%, #ffffff 100%); }
    .result-card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; }
    .badge-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .result-badge { display: inline-flex; align-items: center; border-radius: 999px; padding: 7px 12px; font-size: 13px; font-weight: 700; }
    .result-badge.primary { background: #ddf2e8; color: #145742; }
    .result-badge.accent { background: #f7ead3; color: #895b06; }
    .result-card-table { width: 100%; border-collapse: collapse; }
    .result-card-table th, .result-card-table td { border: 1px solid #d2dfd8; padding: 10px; text-align: left; font-size: 14px; }
    .result-card-table th { background: #edf6f2; }
    .result-card-table .totals-row th, .result-card-table .totals-row td { background: #eef8f3; font-weight: 700; }
    .result-card-note { margin-top: 14px; color: #4f6c61; font-size: 13px; }
    .result-card-footer { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 18px; }
    .result-card-sign { border-top: 2px solid #b7ccc1; padding-top: 8px; color: #345e50; font-weight: 700; text-align: center; }
    @media print { body { background: #fff; padding: 0; } .result-card-shell { box-shadow: none; } }
  `;
}

function buildResultCardDocument(data, title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <style>${resultCardDocumentStyles()}</style>
</head>
<body>
  ${buildResultCardMarkup(data)}
</body>
</html>`;
}

function renderResultCard(data) {
  resultCardPreview.innerHTML = buildResultCardMarkup(data);
}

async function generateResultCard({ silent = false } = {}) {
  const studentId = Number(resultCardStudent?.value || 0);
  const examName = String(resultCardExam?.value || '').trim();

  if (!studentId || !examName) {
    if (!silent) throw new Error('Student aur exam select karein.');
    clearResultCardPreview();
    return null;
  }

  const selectedStudent = allStudents.find((student) => Number(student.id) === studentId);
  if (!selectedStudent) throw new Error('Student record nahi mila.');

  const rows = await api(`/api/results?studentId=${studentId}&examName=${encodeURIComponent(examName)}`);
  if (!rows.length) throw new Error('Is exam ke saved marks nahi mile.');

  const orderedRows = rows.slice().sort((a, b) => String(a.subject || '').localeCompare(String(b.subject || '')));
  const totalMax = orderedRows.reduce((sum, row) => sum + Number(row.max_marks || 0), 0);
  const totalObtained = orderedRows.reduce((sum, row) => sum + Number(row.obtained_marks || 0), 0);
  const percentage = totalMax ? (totalObtained / totalMax) * 100 : 0;
  const className = `${selectedStudent.class_name}${selectedStudent.section ? `-${selectedStudent.section}` : ''}`;

  currentResultCard = {
    schoolName: RESULT_CARD_SCHOOL_PROFILE.name,
    contact: RESULT_CARD_SCHOOL_PROFILE.contact,
    campus: RESULT_CARD_SCHOOL_PROFILE.campus,
    logoUrl: getSchoolLogoUrl(),
    examName,
    issueDate: new Date().toLocaleDateString(),
    generatedAt: new Date().toLocaleString(),
    studentName: selectedStudent.full_name,
    admissionNo: selectedStudent.admission_no || '-',
    parentName: selectedStudent.parent_name || '-',
    className,
    bFormNo: selectedStudent.b_form_no || '-',
    phone: selectedStudent.phone || '-',
    totalMarksLabel: `${formatMoney(totalObtained)}/${formatMoney(totalMax)}`,
    percentageLabel: `${percentage.toFixed(2)}%`,
    overallGrade: computeOverallGrade(percentage),
    performanceLabel: getPerformanceLabel(percentage),
    overallRemarks: getOverallRemarks(percentage),
    passStatus: percentage >= 50 ? 'Status: Pass' : 'Status: Needs Attention',
    subjectCountLabel: `${orderedRows.length} Subjects`,
    subjects: orderedRows.map((row) => ({
      subject: row.subject || '-',
      marksLabel: `${formatMoney(row.obtained_marks)}/${formatMoney(row.max_marks)}`,
      grade: row.grade || computeOverallGrade((Number(row.obtained_marks || 0) / Math.max(Number(row.max_marks || 1), 1)) * 100),
      remarks: row.remarks || getPerformanceLabel((Number(row.obtained_marks || 0) / Math.max(Number(row.max_marks || 1), 1)) * 100),
    })),
  };

  renderResultCard(currentResultCard);
  setResultCardActionsState(true);

  if (!silent) {
    setMessage('resultCardMsg', 'Professional result card generate ho gaya.');
  }

  return currentResultCard;
}

function saveResultCardFile() {
  if (!currentResultCard) return;
  const doc = buildResultCardDocument(currentResultCard, 'Student Result Card');
  const blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
  const safeExam = String(currentResultCard.examName || 'exam').replace(/[^\w-]+/g, '_');
  const fileName = `result_card_${currentResultCard.admissionNo || 'student'}_${safeExam}.html`;
  const link = document.createElement('a');
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
  setMessage('resultCardMsg', 'Result card file save ho gaya.');
}

function printResultCardFile() {
  if (!currentResultCard) return;

  const printWindow = window.open('', '_blank', 'width=980,height=760');
  if (!printWindow) {
    setMessage('resultCardMsg', 'Popup blocked hai. Browser mein popups allow karein.', 'error');
    return;
  }

  printWindow.document.write(buildResultCardDocument(currentResultCard, 'Print Result Card'));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function serializeTableForExport(tableEl) {
  if (!tableEl) return '';
  const clone = tableEl.cloneNode(true);
  const rows = Array.from(clone.querySelectorAll('tr'));
  rows.forEach((row) => {
    const cells = Array.from(row.children);
    const lastCell = cells[cells.length - 1];
    if (lastCell && /action/i.test(lastCell.textContent.trim())) {
      lastCell.remove();
      return;
    }

    const buttonCell = lastCell && lastCell.querySelector('button') ? lastCell : null;
    if (buttonCell) {
      buttonCell.remove();
    }
  });
  return clone.outerHTML;
}

function buildRecordsDocument() {
  const sections = [
    { title: 'Students', table: document.getElementById('studentsTable') },
    { title: 'Attendance Records', table: document.getElementById('attendanceTable') },
    { title: 'Result Records', table: document.getElementById('resultsTable') },
    { title: 'Fee Records', table: document.getElementById('feesTable') },
    { title: 'Fee Defaulters', table: document.getElementById('defaultersTable') },
    { title: 'Fee Paid', table: document.getElementById('paidFeesTable') },
    { title: 'Notices', table: document.getElementById('noticesTable') },
    { title: 'Timetable', table: document.getElementById('timetableTable') },
  ]
    .filter((item) => item.table)
    .map(
      (item) => `
        <section class="records-block">
          <h2>${escapeHtml(item.title)}</h2>
          ${serializeTableForExport(item.table)}
        </section>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>School Records Snapshot</title>
  <style>
    body { margin: 0; padding: 24px; font-family: Arial, sans-serif; background: #f3f7f5; color: #17352d; }
    .records-shell { max-width: 1100px; margin: 0 auto; background: #fff; border: 1px solid #c9d8d0; border-radius: 18px; padding: 24px; }
    .records-head { display: flex; justify-content: space-between; gap: 16px; align-items: center; border-bottom: 2px solid #d6e2dc; padding-bottom: 14px; margin-bottom: 18px; }
    .records-brand { display: flex; align-items: center; gap: 14px; }
    .records-brand img { width: 58px; height: 58px; object-fit: contain; }
    .records-brand h1, .records-brand p, .records-meta p { margin: 0; }
    .records-brand h1 { font-size: 26px; color: #0f5343; text-transform: uppercase; }
    .records-meta p + p { margin-top: 6px; }
    .records-block { margin-top: 20px; }
    .records-block h2 { margin: 0 0 10px; color: #173f34; }
    table { width: 100%; border-collapse: collapse; min-width: 0; }
    th, td { border: 1px solid #c5d6cd; padding: 8px; text-align: left; font-size: 14px; }
    th { background: #e7f2ec; color: #1f473a; }
  </style>
</head>
<body>
  <div class="records-shell">
    <div class="records-head">
      <div class="records-brand">
        <img src="${escapeHtml(getSchoolLogoUrl())}" alt="${escapeHtml(RESULT_CARD_SCHOOL_PROFILE.name)}" />
        <div>
          <h1>${escapeHtml(RESULT_CARD_SCHOOL_PROFILE.name)}</h1>
          <p>Saved Records File</p>
        </div>
      </div>
      <div class="records-meta">
        <p><strong>Generated:</strong> ${escapeHtml(new Date().toLocaleString())}</p>
        <p><strong>Contact:</strong> ${escapeHtml(RESULT_CARD_SCHOOL_PROFILE.contact)}</p>
      </div>
    </div>
    ${sections}
  </div>
</body>
</html>`;
}

function saveRecordsSnapshot() {
  const doc = buildRecordsDocument();
  const blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
  const fileName = `school_records_${new Date().toISOString().slice(0, 10)}.html`;
  const link = document.createElement('a');
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
  setMessage('recordsMsg', 'Current records file save ho gayi.');
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

async function loadDefaulters() {
  if (!authUser || authUser.role !== 'Admin') return;
  if (!defaulterClassFilter || !defaulterMonthFilter) return;

  const params = new URLSearchParams();
  const className = defaulterClassFilter.value;
  const feeMonth = defaulterMonthFilter.value;
  if (className) params.set('className', className);
  if (feeMonth) params.set('feeMonth', feeMonth);

  const rows = await api(`/api/fees/defaulters?${params.toString()}`);
  renderDefaulters(Array.isArray(rows) ? rows : []);
}

async function loadPaidFees() {
  if (!authUser || authUser.role !== 'Admin') return;
  if (!paidClassFilter || !paidMonthFilter) return;

  const params = new URLSearchParams();
  const className = paidClassFilter.value;
  const feeMonth = paidMonthFilter.value;
  if (className) params.set('className', className);
  if (feeMonth) params.set('feeMonth', feeMonth);

  const rows = await api(`/api/fees/paid?${params.toString()}`);
  renderPaidFees(Array.isArray(rows) ? rows : []);
}

function renderExpenses(rows) {
  if (!expensesTableBody) return;
  expensesTableBody.innerHTML = '';

  if (!rows.length) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="5">No expenses yet.</td>';
    expensesTableBody.appendChild(tr);
    return;
  }

  rows.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.expense_date || '-'}</td>
      <td>${escapeHtml(row.category || '-')}</td>
      <td>Rs. ${formatMoney(row.amount || 0)}</td>
      <td>${escapeHtml(row.payment_mode || '-')}</td>
      <td>${escapeHtml(row.remarks || '-')}</td>
    `;
    expensesTableBody.appendChild(tr);
  });
}

async function loadExpenseSummary() {
  if (!authUser || authUser.role !== 'Admin') return;
  if (!incomeSummaryValue || !expenseSummaryValue || !netSummaryValue) return;

  const month = expenseMonthFilter?.value || '';
  const params = new URLSearchParams();
  if (month) params.set('month', month);

  const data = await api(`/api/expenses/summary?${params.toString()}`);
  const totalIncome = Number(data.totalIncome || 0);
  const totalExpense = Number(data.totalExpense || 0);
  const netTotal = Number(data.netTotal || 0);

  incomeSummaryValue.textContent = `Rs. ${formatMoney(totalIncome)}`;
  expenseSummaryValue.textContent = `Rs. ${formatMoney(totalExpense)}`;
  netSummaryValue.textContent = `Rs. ${formatMoney(netTotal)}`;

  if (incomeSummaryMeta) {
    incomeSummaryMeta.textContent = `${Number(data.incomeCount || 0)} paid records`;
  }
  if (expenseSummaryMeta) {
    expenseSummaryMeta.textContent = `${Number(data.expenseCount || 0)} entries`;
  }
  if (netSummaryMeta && data.month) {
    netSummaryMeta.textContent = `Month: ${data.month}`;
  }

  if (allTimeExpenseValue) {
    allTimeExpenseValue.textContent = `Rs. ${formatMoney(Number(data.allTimeExpense || 0))}`;
  }
  if (allTimeNetValue) {
    allTimeNetValue.textContent = `Rs. ${formatMoney(Number(data.allTimeNet || 0))}`;
  }
  if (allTimeExpenseMeta) {
    allTimeExpenseMeta.textContent = 'All records';
  }
  if (allTimeNetMeta) {
    allTimeNetMeta.textContent = 'Total income - expenses';
  }
}

async function loadExpenses() {
  if (!authUser || authUser.role !== 'Admin') return;

  const params = new URLSearchParams();
  const month = expenseMonthFilter?.value || '';
  if (month) params.set('month', month);

  const rows = await api(`/api/expenses?${params.toString()}`);
  renderExpenses(Array.isArray(rows) ? rows : []);
}

async function refreshData() {
  if (!authUser) return;

  const requests = [
    api('/api/students'),
    authUser.role === 'Admin' ? api('/api/fees') : Promise.resolve([]),
    api('/api/notices'),
    api('/api/timetable'),
    authUser.role === 'Admin' ? loadAbsenceNotificationSettings() : Promise.resolve(),
  ];
  const [students, fees, notices, timetable] = await Promise.all(requests);

  allStudents = students;
  allFees = fees;
  resultSubjectTemplates = {};
  updateAbsenceNotificationUI();

  populateStudentSelects();
  renderClassColumns();
  applyStudentFilters();
  applyFeeFilters();
  renderNotices(notices);
  renderTimetable(timetable);
  syncVoucherAutoGenerate().catch(() => {});
  if (resultCardStudent?.value) {
    await syncResultCardExamOptions(resultCardExam?.value || '');
  }

  if (authUser.role === 'Admin' && absenceNotificationsEnabled) {
    subscribeCurrentDeviceToPush().catch(() => {});
  }

  await Promise.all([loadAttendanceRecords(), loadResultRecords(), loadDashboard()]);
  await loadDefaulters();
  await loadPaidFees();
  await updateFeeSummary();
  await loadExpenseSummary();
  await loadExpenses();
  await startAbsenceNotificationPolling();
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
  stopAbsenceNotificationPolling();
  absenceNotificationsEnabled = false;
  saveAbsenceNotificationPreference(false);
  setAuth('', null);
  allFees = [];
  clearResultCardPreview();
  clearSyllabusPreview();
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

resultTemplateForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const className = resultTemplateClass.value;
    const subjects = parseSubjectTemplateLines(resultTemplateLines.value);
    if (!subjects.length) throw new Error('Kam az kam aik subject likhein.');

    await api('/api/result-subjects', {
      method: 'POST',
      body: JSON.stringify({ className, subjects }),
    });

    await syncResultTemplateEditor(className);
    if (bulkResultClass && bulkResultClass.value === className) {
      await syncBulkResultRows(className);
    }
    setMessage('resultTemplateMsg', 'Class subjects save ho gaye.');
  } catch (error) {
    setMessage('resultTemplateMsg', error.message, 'error');
  }
});

syllabusTemplateForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const className = syllabusTemplateClass.value;
    const termName = String(syllabusTemplateTerm?.value || '').trim();
    const subjects = readSyllabusTemplateFields();
    if (!className || !termName) throw new Error('Class aur term name required hain.');
    if (!subjects.length) throw new Error('Kam az kam aik subject likhein.');

    await api('/api/syllabus-templates', {
      method: 'POST',
      body: JSON.stringify({ className, termName, subjects }),
      });

    await syncSyllabusTemplateEditor(className, termName);
    setMessage('syllabusTemplateMsg', 'Syllabus template save ho gaya.');
  } catch (error) {
    setMessage('syllabusTemplateMsg', error.message, 'error');
  }
});

syllabusForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await generateSyllabus({ silent: false });
  } catch (error) {
    setMessage('syllabusMsg', error.message, 'error');
  }
});

bulkResultForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const className = bulkResultClass.value;
    const studentId = Number(bulkResultStudent.value || 0);
    const examName = String(bulkResultExamName.value || '').trim();
    const rowEls = Array.from(bulkResultRows.querySelectorAll('.bulk-result-row'));

    if (!className || !studentId || !examName) {
      throw new Error('Class, student aur exam name required hain.');
    }

    const entries = rowEls.map((rowEl) => ({
      subject: rowEl.querySelector('input[name="subjectName"]')?.value || '',
      maxMarks: Number(rowEl.querySelector('input[name="maxMarks"]')?.value || 0),
      obtainedMarks: Number(rowEl.querySelector('input[name="obtainedMarks"]')?.value || 0),
      remarks: rowEl.querySelector('input[name="remarks"]')?.value || '',
    }));

    if (!entries.length) throw new Error('Is class ke subjects abhi setup nahi hue.');
    if (entries.some((entry) => !entry.subject || Number.isNaN(entry.maxMarks) || Number.isNaN(entry.obtainedMarks))) {
      throw new Error('Har subject ke max marks aur obtained marks fill karein.');
    }

    await api('/api/results/bulk', {
      method: 'POST',
      body: JSON.stringify({ studentId, examName, entries }),
    });

    setMessage('bulkResultMsg', 'Tamam subjects ke marks aik dafa save ho gaye.');
    resultClassFilter.value = className;
    await Promise.all([loadResultRecords(), loadDashboard()]);
    resultCardClass.value = className;
    populateStudentSelects();
    resultCardStudent.value = String(studentId);
    await syncResultCardExamOptions(examName);
  } catch (error) {
    setMessage('bulkResultMsg', error.message, 'error');
  }
});

attendanceForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = getFormData(attendanceForm);
    payload.studentId = Number(payload.studentId);
    const editId = Number(attendanceForm.dataset.editId || 0);
    let savedAttendance;

    if (editId) {
      savedAttendance = await api(`/api/attendance/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
      clearEditMode('attendance');
      setMessage('attendanceMsg', 'Attendance updated successfully.');
    } else {
      savedAttendance = await api('/api/attendance', { method: 'POST', body: JSON.stringify(payload) });
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

    if (savedAttendance?.status === 'Absent' && authUser?.role === 'Admin' && isAbsenceNotificationsEnabled()) {
      markAbsenceAsSeen(savedAttendance.id);
      await showAbsenceNotification(savedAttendance);
    }
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
    const selectedStudentId = String(payload.studentId);
    const selectedExam = payload.examName;
    resultForm.reset();
    resultForm.elements.className.value = selectedClass;
    resultClassFilter.value = selectedClass;

    populateStudentSelects();
    await Promise.all([loadResultRecords(), loadDashboard()]);

    resultCardClass.value = selectedClass;
    populateStudentSelects();
    resultCardStudent.value = selectedStudentId;
    await syncResultCardExamOptions(selectedExam);
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
    setFeeTotalManualFlag(false);
    populateStudentSelects();

    const verb = editId ? 'updated' : 'saved';
    setMessage('feeMsg', `Fee record ${verb}. Total: Rs. ${Number(saved.total_amount || 0).toFixed(2)}, Due: Rs. ${Number(saved.due_amount || 0).toFixed(2)}`);
    await refreshData();

    voucherClass.value = payload.className;
    populateStudentSelects();
    voucherStudent.value = String(saved.student_id || payload.studentId);
    voucherForm.elements.feeMonth.value = String(saved.fee_month || payload.feeMonth);
    syncVoucherAutoGenerate().catch(() => {});
    if (currentVoucher) {
      setMessage('voucherMsg', 'Fee record mil gaya. Voucher auto-generate ho gaya.');
    }
  } catch (error) {
    setMessage('feeMsg', error.message, 'error');
  }
});

expenseForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const payload = getFormData(expenseForm);
    payload.amount = Number(payload.amount || 0);

    await api('/api/expenses', { method: 'POST', body: JSON.stringify(payload) });
    setMessage('expenseMsg', 'Expense saved.');

    const selectedDate = expenseForm.elements.expenseDate?.value;
    expenseForm.reset();
    if (expenseForm.elements.expenseDate) {
      expenseForm.elements.expenseDate.value = selectedDate || new Date().toISOString().slice(0, 10);
    }

    await loadExpenseSummary();
    await loadExpenses();
  } catch (error) {
    setMessage('expenseMsg', error.message, 'error');
  }
});

function parseBulkExpenses(text, fallbackDate) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines
    .map((rawLine) => {
      if (rawLine.includes(',')) {
        const parts = rawLine.split(',').map((part) => part.trim()).filter(Boolean);
        if (parts.length < 2) return null;
        const [datePart, categoryPart, amountPart, modePart, remarksPart] = parts;
        const hasExplicitDate = /^\d{4}-\d{2}-\d{2}$/.test(datePart);
        const expenseDate = hasExplicitDate ? datePart : fallbackDate;
        const category = hasExplicitDate ? categoryPart : datePart;
        const amount = Number(hasExplicitDate ? amountPart : categoryPart);
        const paymentMode = hasExplicitDate ? modePart : amountPart;
        const remarks = hasExplicitDate ? remarksPart : modePart;

        return {
          expenseDate,
          category,
          amount,
          paymentMode: paymentMode || '',
          remarks: remarks || '',
        };
      }

      const tokens = rawLine.split(/\s+/).filter(Boolean);
      if (tokens.length < 2) return null;
      const hasExplicitDate = /^\d{4}-\d{2}-\d{2}$/.test(tokens[0]);
      const amountToken = tokens[tokens.length - 1];
      const amount = Number(amountToken);
      if (!Number.isFinite(amount)) return null;

      const categoryTokens = tokens.slice(hasExplicitDate ? 1 : 0, -1);
      const category = categoryTokens.join(' ');
      return {
        expenseDate: hasExplicitDate ? tokens[0] : fallbackDate,
        category,
        amount,
        paymentMode: '',
        remarks: '',
      };
    })
    .filter(Boolean)
    .filter((row) => row.expenseDate && row.category && Number.isFinite(row.amount) && row.amount > 0);
}

saveBulkExpensesBtn?.addEventListener('click', async () => {
  try {
    const defaultDate = expenseForm?.elements.expenseDate?.value || new Date().toISOString().slice(0, 10);
    const rows = parseBulkExpenses(bulkExpenseInput?.value, defaultDate);
    if (!rows.length) {
      setMessage('expenseMsg', 'Bulk lines sahi format mein nahi hain.', 'error');
      return;
    }

    await api('/api/expenses/bulk', { method: 'POST', body: JSON.stringify({ rows }) });
    setMessage('expenseMsg', `${rows.length} expenses save ho gaye.`);
    if (bulkExpenseInput) bulkExpenseInput.value = '';
    await loadExpenseSummary();
    await loadExpenses();
  } catch (error) {
    setMessage('expenseMsg', error.message, 'error');
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
  setFeeTotalManualFlag(false);
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

paperForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = buildPaperData();
  if (!data) {
    setMessage('paperMsg', 'Paper title, class, aur content required hain.', 'error');
    clearPaperPreview();
    return;
  }
  currentPaper = data;
  renderPaper(currentPaper);
  setPaperActionsState(true);
  setMessage('paperMsg', 'Paper ready ho gaya. Print karke save as PDF kar sakte hain.');
});

resultCardForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await generateResultCard({ silent: false });
  } catch (error) {
    setMessage('resultCardMsg', error.message, 'error');
  }
});

oneClickResultBtn?.addEventListener('click', async () => {
  try {
    await generateResultCard({ silent: false });
  } catch (error) {
    setMessage('resultCardMsg', error.message, 'error');
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
saveClassVoucherBtn?.addEventListener('click', () => saveClassVoucherPdf().catch(() => {}));
printVoucherBtn.addEventListener('click', printVoucherFile);
savePaperBtn?.addEventListener('click', savePaperFile);
printPaperBtn?.addEventListener('click', printPaperFile);
saveResultCardBtn?.addEventListener('click', saveResultCardFile);
printResultCardBtn?.addEventListener('click', printResultCardFile);
saveSyllabusBtn?.addEventListener('click', saveSyllabusFile);
printSyllabusBtn?.addEventListener('click', printSyllabusFile);
saveRecordsBtn?.addEventListener('click', saveRecordsSnapshot);
loadDefaultersBtn?.addEventListener('click', () => {
  syncFeeFilters('defaulter');
  loadDefaulters().catch((error) => setMessage('defaultersMsg', error.message, 'error'));
  updateFeeSummary().catch((error) => setMessage('defaultersMsg', error.message, 'error'));
});
loadPaidFeesBtn?.addEventListener('click', () => {
  syncFeeFilters('paid');
  loadPaidFees().catch((error) => setMessage('paidFeesMsg', error.message, 'error'));
  updateFeeSummary().catch((error) => setMessage('paidFeesMsg', error.message, 'error'));
});

loadExpensesBtn?.addEventListener('click', () => {
  loadExpenses().catch((error) => setMessage('expenseMsg', error.message, 'error'));
  loadExpenseSummary().catch((error) => setMessage('expenseMsg', error.message, 'error'));
});

attendanceClass.addEventListener('change', populateStudentSelects);
resultClass.addEventListener('change', populateStudentSelects);
resultTemplateClass?.addEventListener('change', () => {
  syncResultTemplateEditor(resultTemplateClass.value).catch((error) => setMessage('resultTemplateMsg', error.message, 'error'));
});
syllabusTemplateClass?.addEventListener('change', () => {
  syncSyllabusTemplateEditor(syllabusTemplateClass.value, syllabusTemplateTerm?.value || '').catch((error) =>
    setMessage('syllabusTemplateMsg', error.message, 'error')
  );
});
syllabusTemplateTerm?.addEventListener('change', () => {
  syncSyllabusTemplateEditor(syllabusTemplateClass?.value || '', syllabusTemplateTerm.value || '').catch((error) =>
    setMessage('syllabusTemplateMsg', error.message, 'error')
  );
});
bulkResultClass?.addEventListener('change', () => {
  populateStudentSelects();
  syncBulkResultRows(bulkResultClass.value).catch((error) => setMessage('bulkResultMsg', error.message, 'error'));
});
feeClass.addEventListener('change', () => {
  populateStudentSelects();
  setFeeTotalManualFlag(false);
  updateAutoFeePreview().catch(() => {});
});
syllabusClass?.addEventListener('change', () => {
  populateStudentSelects();
  clearSyllabusPreview();
});
syllabusStudent?.addEventListener('change', () => {
  if (!syllabusStudent.value) {
    clearSyllabusPreview();
    return;
  }
  generateSyllabus({ silent: true }).catch(() => {});
});
syllabusTerm?.addEventListener('input', () => {
  lastSyllabusTerm = syllabusTerm.value;
  if (!syllabusStudent?.value) return;
  generateSyllabus({ silent: true }).catch(() => {});
});
feeStudent.addEventListener('change', () => {
  setFeeTotalManualFlag(false);
  updateAutoFeePreview().catch(() => {});
});
feeTotalAmountInput?.addEventListener('input', () => {
  const hasValue = feeTotalAmountInput.value.trim() !== '';
  setFeeTotalManualFlag(hasValue);
});
feeForm.elements.paymentDate?.addEventListener('change', () => {
  const monthInput = feeForm.elements.feeMonth;
  if (!monthInput?.value) {
    monthInput.value = feeMonthFromPaymentDate(feeForm.elements.paymentDate?.value);
  }
});
voucherClass.addEventListener('change', () => {
  populateStudentSelects();
  syncVoucherAutoGenerate().catch(() => {});
});
voucherStudent.addEventListener('change', () => syncVoucherAutoGenerate().catch(() => {}));
voucherForm.elements.feeMonth?.addEventListener('change', () => syncVoucherAutoGenerate().catch(() => {}));
bulkResultStudent?.addEventListener('change', () => {
  if (!bulkResultStudent.value) {
    setMessage('bulkResultMsg', 'Student select karein.', 'error');
    return;
  }
  setMessage('bulkResultMsg', '');
});
resultCardClass?.addEventListener('change', () => {
  populateStudentSelects();
  renderExamOptions(resultCardExam, [], resultCardClass.value ? 'Select Student First' : 'Select Class First');
  clearResultCardPreview();
});
resultCardStudent?.addEventListener('change', () => {
  syncResultCardExamOptions().catch((error) => setMessage('resultCardMsg', error.message, 'error'));
});
resultCardExam?.addEventListener('change', () => {
  if (!resultCardExam.value) {
    clearResultCardPreview();
    return;
  }

  generateResultCard({ silent: true }).catch((error) => setMessage('resultCardMsg', error.message, 'error'));
});

studentClassFilter.addEventListener('change', applyStudentFilters);
studentSearchInput.addEventListener('input', applyStudentFilters);
feeClassFilter.addEventListener('change', applyFeeFilters);
defaulterClassFilter?.addEventListener('change', () => {
  syncFeeFilters('defaulter');
  loadDefaulters().catch((error) => setMessage('defaultersMsg', error.message, 'error'));
  updateFeeSummary().catch((error) => setMessage('defaultersMsg', error.message, 'error'));
});
defaulterMonthFilter?.addEventListener('change', () => {
  syncFeeFilters('defaulter');
  loadDefaulters().catch((error) => setMessage('defaultersMsg', error.message, 'error'));
  updateFeeSummary().catch((error) => setMessage('defaultersMsg', error.message, 'error'));
});
paidClassFilter?.addEventListener('change', () => {
  syncFeeFilters('paid');
  loadPaidFees().catch((error) => setMessage('paidFeesMsg', error.message, 'error'));
  updateFeeSummary().catch((error) => setMessage('paidFeesMsg', error.message, 'error'));
});
paidMonthFilter?.addEventListener('change', () => {
  syncFeeFilters('paid');
  loadPaidFees().catch((error) => setMessage('paidFeesMsg', error.message, 'error'));
  updateFeeSummary().catch((error) => setMessage('paidFeesMsg', error.message, 'error'));
});

expenseMonthFilter?.addEventListener('change', () => {
  loadExpenses().catch((error) => setMessage('expenseMsg', error.message, 'error'));
  loadExpenseSummary().catch((error) => setMessage('expenseMsg', error.message, 'error'));
});
attendanceClassFilter.addEventListener('change', () => loadAttendanceRecords().catch((error) => setMessage('attendanceMsg', error.message, 'error')));
attendanceDateFilter.addEventListener('change', () => loadAttendanceRecords().catch((error) => setMessage('attendanceMsg', error.message, 'error')));
loadAttendanceBtn.addEventListener('click', () => loadAttendanceRecords().catch((error) => setMessage('attendanceMsg', error.message, 'error')));
absenceNotificationsToggle?.addEventListener('change', (event) => {
  setAbsenceNotificationsEnabled(Boolean(event.target.checked)).catch((error) => {
    updateAbsenceNotificationUI();
    setMessage('attendanceMsg', error.message, 'error');
  });
});
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

function handleSyllabusQuickView(event, button) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (!syllabusForm || !syllabusClass || !syllabusStudent || !syllabusTerm) return;
  if (!authUser) return;

  const row = decodeRowPayload(button);
  if (!row) {
    setMessage('syllabusMsg', 'Student data load nahi hui.', 'error');
    return;
  }

  setPortalPage('portal');
  setClassOnSelect(syllabusClass, row.class_name || '');
  populateStudentSelects();
  syllabusStudent.value = String(row.id || '');

  if (!syllabusTerm.value) {
    syllabusTerm.value = lastSyllabusTerm || 'Term 1';
  }
  lastSyllabusTerm = syllabusTerm.value;

  generateSyllabus({ silent: false })
    .then(() => scrollFormIntoView(syllabusForm))
    .catch((error) => setMessage('syllabusMsg', error.message, 'error'));
}
loadResultBtn.addEventListener('click', () => loadResultRecords().catch((error) => setMessage('resultMsg', error.message, 'error')));

async function boot() {
  setupPortalPages();
  setupControls();
  setupInstallPrompt();
  absenceNotificationsEnabled = loadAbsenceNotificationPreference();
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



































