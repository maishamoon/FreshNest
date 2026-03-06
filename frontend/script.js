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
// ── PRODUCE ───────────────────────────────────────────────
async function loadProduce() {
  const res = await apiCall('GET', '/produce');
  produceList = res.success ? res.data : [];
  renderProduceTable();
}
function renderProduceTable() {
  const wrap = document.getElementById('produce-table-wrap');
  if (!produceList.length) {
    wrap.innerHTML = `<div class="empty"><div class="empty-icon">🌾</div><h4>No produce listed yet</h4><p>Click "Add Produce" to list your first crop</p></div>`;
    return;
  }
  wrap.innerHTML = `
    <table>
      <thead><tr>
        <th>Produce</th><th>Category</th><th>Quantity</th>
        <th>Harvest Date</th><th>Location</th><th>Status</th><th>Action</th>
      </tr></thead>
      <tbody>
        ${produceList.map(p => `
          <tr>
            <td><strong>${p.name}</strong></td>
            <td>${p.category}</td>
            <td>${p.quantity} ${p.unit}</td>
            <td>${p.harvest_date ? p.harvest_date.slice(0,10) : '—'}</td>
            <td>${p.location}</td>
            <td>${badgeProduce(p.status)}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteProduce(${p.id})">Remove</button></td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

function badgeProduce(s) {
  const map = { Available:'badge-green', Sold:'badge-gray', Reserved:'badge-amber', Expired:'badge-red' };
  return `<span class="badge ${map[s]||'badge-gray'}">${s}</span>`;
}

async function addProduce() {
  hideAlert('produce-alert');
  const name       = document.getElementById('p-name').value.trim();
  const category   = document.getElementById('p-category').value;
  const quantity   = document.getElementById('p-quantity').value;
  const unit       = document.getElementById('p-unit').value;
  const harvestDate = document.getElementById('p-date').value;
  const location   = document.getElementById('p-location').value.trim();
  const storageTmp = document.getElementById('p-temp').value.trim();
  const freshDays  = document.getElementById('p-freshdays').value || 0;
  const tips       = document.getElementById('p-tips').value.trim();

  if (!name || !quantity || !harvestDate || !location)
    return showAlert('produce-alert', 'Please fill in all required fields (*).');

  const res = await apiCall('POST', '/produce', {
    name, category, quantity: +quantity, unit, harvest_date: harvestDate,
    location, storage_temp: storageTmp, fresh_days: +freshDays, storage_tips: tips
  });

  if (!res.success) return showAlert('produce-alert', res.error || 'Failed to add produce.');

  closeModal('modal-add-produce');
  // Reset fields
  ['p-name','p-quantity','p-date','p-location','p-temp','p-freshdays','p-tips'].forEach(id => document.getElementById(id).value = '');
  loadProduce();
  loadStats();
}

async function deleteProduce(id) {
  if (!confirm('Remove this produce listing?')) return;
  const res = await apiCall('DELETE', '/produce/' + id);
  if (res.success) { loadProduce(); loadStats(); }
  else alert(res.error || 'Failed to remove.');
}
// ── TRANSPORT ─────────────────────────────────────────────
async function loadTransport() {
  const res = await apiCall('GET', '/transport');
  transportList = res.success ? res.data : [];
  renderTransportTable();
}

function renderTransportTable() {
  const wrap = document.getElementById('transport-table-wrap');
  if (!transportList.length) {
    wrap.innerHTML = `<div class="empty"><div class="empty-icon">🚛</div><h4>No transport requests yet</h4><p>Click "New Request" to arrange pickup</p></div>`;
    return;
  }
  wrap.innerHTML = `
    <table>
      <thead><tr>
        <th>Produce</th><th>Pickup</th><th>Destination</th>
        <th>Quantity</th><th>Date</th><th>Status</th><th>Action</th>
      </tr></thead>
      <tbody>
        ${transportList.map(t => `
          <tr>
            <td><strong>${t.produce_name}</strong></td>
            <td>${t.pickup_location || '—'}</td>
            <td>${t.destination}</td>
            <td>${t.quantity || '—'}</td>
            <td>${t.pickup_date ? t.pickup_date.slice(0,10) : '—'}</td>
            <td>${badgeTransport(t.status)}</td>
            <td>${t.status==='Open' ? `<button class="btn btn-danger btn-sm" onclick="cancelTransport(${t.id})">Cancel</button>` : '—'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

function badgeTransport(s) {
  const map = { Open:'badge-blue', Accepted:'badge-amber', Completed:'badge-green', Cancelled:'badge-gray', Failed:'badge-red' };
  return `<span class="badge ${map[s]||'badge-gray'}">${s}</span>`;
}

async function addTransport() {
  hideAlert('transport-alert');
  const produce  = document.getElementById('t-produce').value.trim();
  const dest     = document.getElementById('t-dest').value.trim();
  const pickup   = document.getElementById('t-pickup').value.trim();
  const qty      = document.getElementById('t-quantity').value.trim();
  const date     = document.getElementById('t-date').value;
  const notes    = document.getElementById('t-notes').value.trim();

  if (!produce || !dest) return showAlert('transport-alert', 'Produce name and destination are required (*).');

  const res = await apiCall('POST', '/transport', {
    produce_name: produce, destination: dest, pickup_location: pickup,
    quantity: qty, pickup_date: date || null, notes
  });

  if (!res.success) return showAlert('transport-alert', res.error || 'Failed to submit request.');

  closeModal('modal-add-transport');
  ['t-produce','t-dest','t-pickup','t-quantity','t-date','t-notes'].forEach(id => document.getElementById(id).value = '');
  loadTransport();
  loadStats();
}

async function cancelTransport(id) {
  if (!confirm('Cancel this transport request?')) return;
  const res = await apiCall('PATCH', '/transport/' + id, { status: 'Cancelled' });
  if (res.success) loadTransport();
  else alert(res.error || 'Failed to cancel.');
}

// ── CLOSE MODALS ON OVERLAY CLICK ─────────────────────────
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
});

// ── ENTER KEY LOGIN ───────────────────────────────────────
document.getElementById('login-password').addEventListener('keydown', e => { if (e.key==='Enter') doLogin(); });
