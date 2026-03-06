// ── CONFIG ────────────────────────────────────────────────
const API = 'http://localhost:5000/api';

// ── STATE ─────────────────────────────────────────────────
let token = '';
let user  = null;
let produceList   = [];
let transportList = [];

// ── HELPERS ───────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
}

function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('section-' + name).classList.add('active');
  document.getElementById('nav-' + name).classList.add('active');
  if (name === 'produce')   loadProduce();
  if (name === 'transport') loadTransport();
}

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function showAlert(id, msg, type='error') {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = `alert alert-${type} show`;
}
function hideAlert(id) {
  document.getElementById(id).className = 'alert';
}

async function apiCall(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }
  };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(API + path, opts);
  return r.json();
}// ── AUTH ──────────────────────────────────────────────────
async function doLogin() {
  hideAlert('login-alert');
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-password').value;
  if (!email || !pass) return showAlert('login-alert', 'Please enter email and password.');

  const res = await apiCall('POST', '/auth/login', { email, password: pass });
  if (!res.success) return showAlert('login-alert', res.error || 'Login failed.');

  token = res.data.token;
  user  = res.data.user;
  initDashboard();
  showPage('dashboard');
}

async function doRegister() {
  hideAlert('reg-alert');
  hideAlert('reg-success');
  const name     = document.getElementById('reg-name').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const role     = document.getElementById('reg-role').value;
  const location = document.getElementById('reg-location').value.trim();

  if (!name || !email || !password) return showAlert('reg-alert', 'Name, email and password are required.');
  if (password.length < 6)          return showAlert('reg-alert', 'Password must be at least 6 characters.');

  const res = await apiCall('POST', '/auth/register', { name, email, password, role, location });
  if (!res.success) return showAlert('reg-alert', res.error || 'Registration failed.');

  showAlert('reg-success', '✅ Account created! You can now login.', 'success');
  setTimeout(() => showPage('login'), 1500);
}

function doLogout() {
  token = '';
  user  = null;
  produceList = [];
  transportList = [];
  showPage('login');
}
// ── DASHBOARD INIT ────────────────────────────────────────
function initDashboard() {
  document.getElementById('welcome-msg').textContent = `Hello, ${user.name}! 👋`;
  document.getElementById('user-chip').textContent   = `👤 ${user.name}`;
  document.getElementById('role-tag').textContent    = user.role === 'farmer' ? '🌾 Farmer' : user.role;
  showSection('home');
  loadStats();
}

async function loadStats() {
  const [pr, tr] = await Promise.all([
    apiCall('GET', '/produce'),
    apiCall('GET', '/transport')
  ]);
  produceList   = pr.success   ? pr.data   : [];
  transportList = tr.success   ? tr.data   : [];
  document.getElementById('stat-produce').textContent   = produceList.length;
  document.getElementById('stat-transport').textContent = transportList.length;
  document.getElementById('stat-active').textContent    = produceList.filter(p => p.status === 'Available').length;
}