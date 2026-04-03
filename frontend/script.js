// ─── DATA STORE ───────────────────────────────────────────────────────────────
const PRODUCE_DB = {
  // FRUITS
  'Mango':       { cat:'Fruit', emoji:'🥭', temp:'13–15°C', humidity:'85–90%', freshDays:14, tips:'Store away from ethylene-sensitive produce. Ripen at room temperature.', harvestMonths:'May–July' },
  'Banana':      { cat:'Fruit', emoji:'🍌', temp:'13–15°C', humidity:'85–95%', freshDays:7,  tips:'Never refrigerate unripe bananas. Keep dry and ventilated.', harvestMonths:'Year-round' },
  'Litchi':      { cat:'Fruit', emoji:'🍒', temp:'2–5°C',   humidity:'90–95%', freshDays:5,  tips:'Refrigerate immediately after harvest to retain red color.', harvestMonths:'May–June' },
  'Pineapple':   { cat:'Fruit', emoji:'🍍', temp:'7–10°C',  humidity:'85–90%', freshDays:10, tips:'Store upright. Do not stack. Avoid ethylene exposure.', harvestMonths:'Apr–Aug' },
  'Guava':       { cat:'Fruit', emoji:'🍈', temp:'8–10°C',  humidity:'85–90%', freshDays:7,  tips:'Wrap individually in tissue paper for longer shelf life.', harvestMonths:'Year-round' },
  'Papaya':      { cat:'Fruit', emoji:'🍈', temp:'10–13°C', humidity:'85–90%', freshDays:7,  tips:'Harvest at 25% yellow for long-distance transport.', harvestMonths:'Year-round' },
  'Jackfruit':   { cat:'Fruit', emoji:'🟡', temp:'11–14°C', humidity:'85–90%', freshDays:5,  tips:'Cut jackfruit must be refrigerated and consumed within 3 days.', harvestMonths:'Jun–Aug' },
  'Watermelon':  { cat:'Fruit', emoji:'🍉', temp:'10–15°C', humidity:'85–90%', freshDays:14, tips:'Store away from other fruits. Do not refrigerate uncut.', harvestMonths:'Apr–Sep' },
  'Coconut':     { cat:'Fruit', emoji:'🥥', temp:'0–2°C',   humidity:'80–85%', freshDays:30, tips:'Remove husks for longer cold storage. Avoid moisture.', harvestMonths:'Year-round' },
  'Orange':      { cat:'Fruit', emoji:'🍊', temp:'3–9°C',   humidity:'85–90%', freshDays:21, tips:'Check regularly for mold. Do not wash before storage.', harvestMonths:'Nov–Feb' },
  'Strawberry':  { cat:'Fruit', emoji:'🍓', temp:'0–2°C',   humidity:'90–95%', freshDays:5,  tips:'Handle with extreme care. Never wash before storage.', harvestMonths:'Dec–Feb' },
  'Grape':       { cat:'Fruit', emoji:'🍇', temp:'0–2°C',   humidity:'90–95%', freshDays:21, tips:'Store in original clusters. Avoid temperature fluctuation.', harvestMonths:'Dec–Mar' },
   
  // VEGETABLES
  'Tomato':      { cat:'Vegetable', emoji:'🍅', temp:'10–13°C', humidity:'85–90%', freshDays:10, tips:'Store stem-up. Never refrigerate fully ripe tomatoes.', harvestMonths:'Oct–Mar' },
  'Potato':      { cat:'Vegetable', emoji:'🥔', temp:'4–7°C',  humidity:'85–90%', freshDays:60, tips:'Store in dark, dry, cool place. Avoid light to prevent greening.', harvestMonths:'Jan–Mar' },
  'Onion':       { cat:'Vegetable', emoji:'🧅', temp:'0–4°C',  humidity:'65–70%', freshDays:90, tips:'Store dry with good airflow. Low humidity is critical.', harvestMonths:'Jan–Apr' },
  'Eggplant':    { cat:'Vegetable', emoji:'🍆', temp:'10–12°C', humidity:'90–95%', freshDays:7, tips:'Very chilling-sensitive. Keep away from ethylene.', harvestMonths:'Year-round' },
  'Cucumber':    { cat:'Vegetable', emoji:'🥒', temp:'10–13°C', humidity:'90–95%', freshDays:7, tips:'Wrap individually. Ethylene sensitive; isolate from ripening fruits.', harvestMonths:'Year-round' },
  'Cauliflower': { cat:'Vegetable', emoji:'🥦', temp:'0–1°C',  humidity:'90–95%', freshDays:14, tips:'Store wrapped to prevent discoloration. Keep very cold.', harvestMonths:'Nov–Feb' },
  'Cabbage':     { cat:'Vegetable', emoji:'🥬', temp:'0–1°C',  humidity:'90–95%', freshDays:21, tips:'Remove outer damaged leaves before storage.', harvestMonths:'Nov–Feb' },
  'Carrot':      { cat:'Vegetable', emoji:'🥕', temp:'0–1°C',  humidity:'90–95%', freshDays:28, tips:'Remove tops before storage to retain moisture.', harvestMonths:'Nov–Feb' },
  'Spinach':     { cat:'Vegetable', emoji:'🥗', temp:'0–2°C',  humidity:'95–100%',freshDays:5,  tips:'Store in perforated plastic bags. Very perishable.', harvestMonths:'Nov–Feb' },
  'Green Bean':  { cat:'Vegetable', emoji:'🫘', temp:'4–8°C',  humidity:'90–95%', freshDays:7,  tips:'Blanch before freezing for longer storage.', harvestMonths:'Year-round' },
  'Bitter Gourd':{ cat:'Vegetable', emoji:'🫑', temp:'10–12°C', humidity:'85–90%', freshDays:7, tips:'Store in cool and shaded area. Avoid direct sunlight.', harvestMonths:'Year-round' },
  'Pumpkin':     { cat:'Vegetable', emoji:'🎃', temp:'10–13°C', humidity:'60–70%', freshDays:60, tips:'Keep stem intact. Store in dry area with good ventilation.', harvestMonths:'Year-round' },
};

const SEED_USERS = [
  { id:'admin1', name:'Admin User',     email:'admin@harvest.bd', password:'admin123', role:'admin',     joined:'2026-01-01' },
  { id:'farm1',  name:'Rahim Uddin',    email:'rahim@farm.bd',    password:'pass123',  role:'farmer',    location:'Rajshahi', joined:'2026-01-05' },
  { id:'farm2',  name:'Sufia Begum',    email:'sufia@farm.bd',    password:'pass123',  role:'farmer',    location:'Mymensingh', joined:'2026-01-08' },
   { id:'trans1', name:'Karim Transport',email:'karim@trans.bd',   password:'pass123',  role:'transport', vehicle:'Refrigerated Truck', joined:'2026-01-10' },
  { id:'deal1',  name:'Dhaka Fresh Ltd',email:'dhaka@fresh.bd',   password:'pass123',  role:'dealer',    location:'Dhaka', joined:'2026-01-12' },
  { id:'deal2',  name:'Chittagong Grocers',email:'chittagong@fresh.bd',   password:'pass123',  role:'dealer',    location:'Chittagong', joined:'2026-02-18' },
];

const SEED_PRODUCTS = [
  { id:'p1', farmerId:'farm1', farmerName:'Rahim Uddin', name:'Mango', category:'Fruit', quantity:500, unit:'kg', harvestDate:'2026-01-20', location:'Rajshahi', status:'Available', listed:'2026-01-21', ...PRODUCE_DB['Mango'] },
  { id:'p2', farmerId:'farm2', farmerName:'Sufia Begum', name:'Tomato', category:'Vegetable', quantity:300, unit:'kg', harvestDate:'2026-01-22', location:'Mymensingh', status:'Available', listed:'2026-01-22', ...PRODUCE_DB['Tomato'] },
  { id:'p3', farmerId:'farm1', farmerName:'Rahim Uddin', name:'Potato', category:'Vegetable', quantity:1000, unit:'kg', harvestDate:'2026-01-15', location:'Rajshahi', status:'Available', listed:'2026-01-16', ...PRODUCE_DB['Potato'] },
];

const SEED_TRANS = [
  { id:'t1', farmerId:'farm1', farmerName:'Rahim Uddin', product:'Mango', productId:'p1', pickup:'Rajshahi', destination:'Dhaka', date:'2026-02-01', quantity:'500 kg', notes:'Refrigerated vehicle required', status:'Open', created:'2026-01-25' },
];

const SEED_DEALS = [
  { id:'d1', dealerId:'deal1', dealerName:'Dhaka Fresh Ltd', farmerId:'farm1', farmerName:'Rahim Uddin', product:'Mango', productId:'p1', quantity:'200 kg', price:'80', status:'Pending', created:'2026-01-26' },
];

// ─── API CONFIG ───────────────────────────────────────────────────────────────

const DEMO_MODE = window.DEMO_MODE_ENABLED === true || localStorage.getItem('demo_mode') === 'true';
const API_BASE = window.API_BASE || 'http://localhost:5000/api';

function today() { return new Date().toISOString().slice(0,10); }
function toId(value) { return value === null || value === undefined ? '' : String(value); }
function isDemo() { return DEMO_MODE === true; }
async function apiFetch(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (state.token && state.token !== 'demo-token') headers['Authorization'] = 'Bearer ' + state.token;
  let res;
  try {
    res = await fetch(API_BASE + path, { ...opts, headers: { ...headers, ...(opts.headers||{}) } });
  } catch (err) {
    throw new Error('Network error. Please check your connection and try again.');
  }
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { error: text }; }
  if (!res.ok) {
    if (res.status === 401 && state.token && state.token !== 'demo-token') {
      handleAuthExpired(data.error || 'Session expired. Please sign in again.');
    }
    if (DEMO_MODE && (path === '/auth/login' || path === '/auth/register')) {
      throw new Error('Demo mode: ' + (data.error || 'API unavailable'));
    }
    throw new Error(data.error || 'Request failed');
  }
  return data.data;
}

function handleAuthExpired(message) {
  doLogout();
  showAlert('auth-alert', message || 'Session expired. Please sign in again.', 'danger');
}

// ─── DATA NORMALIZERS ─────────────────────────────────────────────────────────


function normUser(u)    { return { ...u, id: toId(u.id), vehicle: u.vehicle_type || u.vehicle || '', joined: (u.created_at || u.joined || '').slice(0,10) }; }
function normProduce(p) {
  const db = PRODUCE_DB[p.name] || {};
  return { ...p, id: toId(p.id), farmerId: toId(p.farmer_id || p.farmerId), farmerName: p.farmer_name || p.farmerName,
    harvestDate: p.harvest_date, temp: p.storage_temp||db.temp||'',
    humidity: p.storage_humidity||db.humidity||'', freshDays: p.fresh_days||db.freshDays||7,
    tips: p.storage_tips||db.tips||'', listed: (p.listed_at||'').slice(0,10),
    emoji: p.emoji||db.emoji||'*', category: p.category||db.cat||'Other',
    expectedPrice: p.expected_price_per_kg };
}

function normTrans(t)   { return { 
    ...t, 
    id: toId(t.id),
    farmerId: toId(t.farmer_id || t.farmerId), 
    farmerName: t.farmer_name || '-',
    product: t.produce_name || '-', 
    productId: toId(t.product_id || t.productId), 
    pickup: t.pickup_location || '-',
    date: t.pickup_date, 
    assignedTo: toId(t.assigned_to || t.assignedTo), 
    transporterName: t.transporter_name || '-',
    created: (t.created_at||'').slice(0,10) 
  }; }
    
    function normDeal(d)    { return { ...d, id: toId(d.id), dealerId: toId(d.dealer_id || d.dealerId), dealerName: d.dealer_name || d.dealerName,
    farmerId: toId(d.farmer_id || d.farmerId), farmerName: d.farmer_name || d.farmerName, product: d.produce_name || d.product,
    productId: toId(d.product_id || d.productId), quantity: d.quantity_requested || d.quantity, 
    expectedPrice: d.expected_price_per_kg, price: d.offered_price_per_kg,
    msg: d.message, created: (d.created_at||'').slice(0,10) }; }

    function normFail(f)    { 
  let alts = [];
  try {
    if (typeof f.alternatives === 'string') {
      alts = JSON.parse(f.alternatives || '[]');
    } else if (Array.isArray(f.alternatives)) {
      alts = f.alternatives;
    }
  } catch (e) { alts = []; }
  return { ...f, id: toId(f.id), transporterId: toId(f.transporter_id || f.transporterId), transporterName: f.transporter_name || f.transporterName,
    requestId: toId(f.transport_request_id || f.requestId), product: f.produce_name || f.product,
    alternatives: alts,
    reported: (f.reported_at||'').slice(0,10) }; }
    // ─── STATE ────────────────────────────────────────────────────────────────────
let state = { user:null, token:null, users:[], products:[], trans:[], deals:[], failures:[], activeNav:null, retryAction:null };

function setPageLoading(message = 'Loading data...') {
  const body = document.getElementById('page-body');
  if (!body) return;
  body.innerHTML = `
    <div class="card">
      <div class="empty-state">
        <div class="empty-icon">â³</div>
        <p>${message}</p>
      </div>
    </div>
  `;
}

function setPageError(message = 'Unable to load data.', actionLabel = 'Retry') {
  const body = document.getElementById('page-body');
  if (!body) return;
  body.innerHTML = `
    <div class="card">
      <div class="empty-state">
        <div class="empty-icon">âš ï¸</div>
        <p>${message}</p>
        ${state.retryAction ? `<button class="btn btn-primary" onclick="retryLastAction()">${actionLabel}</button>` : ''}
      </div>
    </div>
  `;
}

function retryLastAction() {
  if (typeof state.retryAction === 'function') {
    const fn = state.retryAction;
    state.retryAction = null;
    fn();
  }
}

function logMissingFields(entity, items, fields) {
  const missing = items.filter(item => fields.some(f => item[f] === null || item[f] === undefined || item[f] === ''));
  if (missing.length) {
    console.warn(`[data] ${entity} missing fields`, { count: missing.length, fields });
  }
}

async function loadAll() {
  const [products, trans, deals, failures] = await Promise.all([
    apiFetch('/produce').then(r => r.map(normProduce)),
    apiFetch('/transport').then(r => r.map(normTrans)),
    apiFetch('/deals').then(r => r.map(normDeal)),
    apiFetch('/failures').then(r => r.map(normFail)),
  ]);

  state.products = products;
  state.trans    = trans;
  state.deals    = deals;
  state.failures = failures;
  if (state.user.role === 'admin') {
    state.users = await apiFetch('/users').then(r => r.map(normUser));
  }

  logMissingFields('users', state.users, ['id', 'email', 'role']);
  logMissingFields('produce', state.products, ['id', 'farmerId', 'name']);
  logMissingFields('transport', state.trans, ['id', 'farmerId', 'status']);
  logMissingFields('deals', state.deals, ['id', 'dealerId', 'farmerId', 'status']);
}

async function refreshDataAndRender(navId) {
  if (document.getElementById('page-body')) setPageLoading('Refreshing data...');
  state.retryAction = () => refreshDataAndRender(navId);
  try {
    await loadAll();
    if (navId) {
      navigate(navId);
    } else if (state.activeNav) {
      navigate(state.activeNav);
    }
  } catch (err) {
    setPageError(err.message || 'Unable to load data. Please try again.');
  }
}


// ─── HELPERS ──────────────────────────────────────────────────────────────────

function showAlert(id, msg, type='info') {
  const el = document.getElementById(id);
  if(el) el.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
  setTimeout(()=>{ if(el) el.innerHTML=''; }, 4000);
}

function handleApiError(err, alertId, fallbackMessage) {
  const msg = (err && err.message) ? err.message : (fallbackMessage || 'Request failed.');
  showAlert(alertId, msg, 'danger');
}

let sidebarOpen = false;
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebarOpen = !sidebarOpen;
  sidebar.classList.toggle('open', sidebarOpen);
}

function openModal(html) {
  document.getElementById('modal-container').innerHTML = `<div class="modal-overlay" onclick="if(event.target===this)closeModal()">${html}</div>`;
}
function closeModal() { document.getElementById('modal-container').innerHTML=''; }

function badge(status) {
  const map = { 'Open':'badge-blue','Available':'badge-green','Accepted':'badge-sage','Completed':'badge-green','Cancelled':'badge-gray','Pending':'badge-gold','Declined':'badge-red','Failed':'badge-red' };
  return `<span class="badge ${map[status]||'badge-gray'}">${status}</span>`;
}

function produceEmoji(name) { return PRODUCE_DB[name]?.emoji || '🌿'; }

// ─── AUTH ─────────────────────────────────────────────────────────────────────

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t,i)=>t.classList.toggle('active',i===(tab==='login'?0:1)));
  document.getElementById('login-form').style.display    = tab==='login'?'block':'none';
  document.getElementById('register-form').style.display = tab==='register'?'block':'none';
  document.getElementById('auth-alert').innerHTML='';
  
  const hint = document.getElementById('auth-toggle-hint');
  if (hint) {
    if (tab === 'login') {
      hint.innerHTML = 'Don\'t have an account? <a href="javascript:void(0)" onclick="switchAuthTab(\'register\')" style="color:var(--green);font-weight:600;text-decoration:underline">Register</a>';
    } else {
      hint.innerHTML = 'Already have an account? <a href="javascript:void(0)" onclick="switchAuthTab(\'login\')" style="color:var(--green);font-weight:600;text-decoration:underline">Sign In</a>';
    }
  }
}


function loadDemoData() {
  state.users    = SEED_USERS.map(normUser);
  state.products = SEED_PRODUCTS.map(normProduce);
  state.trans     = SEED_TRANS.map(normTrans);
  state.deals     = SEED_DEALS.map(normDeal);
  state.failures  = [];
}

function quickLogin(email, pass) {
  if (!isDemo()) {
    showAlert('auth-alert','Demo mode is disabled. Please sign in with a real account.','danger');
    return;
  }
  document.getElementById('login-email').value = email;
  document.getElementById('login-pass').value = pass;
  const demoUser = SEED_USERS.find(u => u.email === email && u.password === pass);
  
  if (demoUser) {
    state.user  = normUser(demoUser);
    state.token = 'demo-token';
    localStorage.setItem('hl_token', state.token);
    localStorage.setItem('hl_user', JSON.stringify(state.user));
    loadDemoData();
    initApp();
    return;
  }

 doLogin();
}


async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  if (!email || !pass) return showAlert('auth-alert','Email and password required.','danger');
  
  setAuthBtnState('login-btn', true);
  
  if (DEMO_MODE) {
    const user = SEED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (user) {
      state.user  = normUser(user);
      state.token = 'demo-token';
      localStorage.setItem('hl_token', state.token);
      localStorage.setItem('hl_user', JSON.stringify(state.user));
      loadDemoData();
      initApp();
      setAuthBtnState('login-btn', false);
      return;
    }
    showAlert('auth-alert', 'Demo mode: Invalid credentials.', 'danger');
    setAuthBtnState('login-btn', false);
    return;
  }
  
  try {
    showAlert('auth-alert','Signing in...','info');
    const data = await apiFetch('/auth/login', { method:'POST', body: JSON.stringify({ email, password: pass }) });
    state.token = data.token;
    state.user  = normUser(data.user);
    
    try { localStorage.setItem('hl_token', state.token); localStorage.setItem('hl_user', JSON.stringify(state.user)); } catch(_){}
    await loadAll();
    initApp();
  } 
    
  catch(e) {
    showAlert('auth-alert', e.message || 'Invalid email or password.', 'danger');
  }
  setAuthBtnState('login-btn', false);
}

function setAuthBtnState(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn.dataset.origText = btn.textContent;
    btn.textContent = 'Please wait...';
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.origText || btn.textContent;
  }
}

function toggleRoleFields() {
  const r = document.getElementById('reg-role').value;
  document.getElementById('field-location').style.display = r!=='transport'?'block':'none';
  document.getElementById('field-vehicle').style.display  = r==='transport'?'block':'none';
}


async function doRegister() {
  const name=document.getElementById('reg-name').value.trim();
  const email=document.getElementById('reg-email').value.trim();
  const pass=document.getElementById('reg-pass').value;
  const role=document.getElementById('reg-role').value;
  
  if(!name||!email||!pass) return showAlert('auth-alert','All fields are required.','danger');
  
  if(pass.length < 6) return showAlert('auth-alert','Password must be at least 6 characters.','danger');
  
  const location = document.getElementById('reg-location')?.value||'';
  
  const vehicle  = document.getElementById('reg-vehicle')?.value||'';
  
  setAuthBtnState('reg-btn', true);
  
  if (DEMO_MODE) {
    const emailExists = SEED_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      showAlert('auth-alert','Email already registered.','danger');
      setAuthBtnState('reg-btn', false);
      return;
    }
    const newUser = { id:'user'+Date.now(), name, email, password:pass, role, location, vehicle, joined:today() };
    SEED_USERS.push(newUser);
    state.users.push(normUser(newUser));
    showAlert('auth-alert','Registration successful! You can now sign in.','success');
    switchAuthTab('login');
    document.getElementById('login-email').value = email;
    setAuthBtnState('reg-btn', false);
    return;
  }
  
  try {
    showAlert('auth-alert','Registering...','info');
    const newUserData = await apiFetch('/auth/register', { method:'POST', body: JSON.stringify({ name, email, password: pass, role, location, vehicle }) });
    showAlert('auth-alert','Registration successful! You can now sign in.','success');
    switchAuthTab('login');
    document.getElementById('login-email').value = email;
    setAuthBtnState('reg-btn', false);
  } 
  catch(e) {
    setAuthBtnState('reg-btn', false);
    showAlert('auth-alert', e.message || 'Registration failed. Try different email.', 'danger');
    switchAuthTab('login');
    document.getElementById('login-email').value = email;
  }
}


function doLogout() {
  state.user = null;
  state.token = null;
  state.users = []; state.products = []; state.trans = []; state.deals = []; state.failures = [];
  state.activeNav = null;
  state.retryAction = null;
  try { localStorage.removeItem('hl_token'); localStorage.removeItem('hl_user'); } catch(_){}
  document.getElementById('app').style.display='none';
  document.getElementById('auth-page').style.display='flex';
}


// ─── APP INIT ─────────────────────────────────────────────────────────────────

const ROLE_CFG = {
  farmer:    { color:'#27AE60', bg:'#1E8449', icon:'🌾', navItems: [
    { id:'dashboard', label:'Dashboard',          icon:'📊' },
    { id:'products',  label:'My Produce',         icon:'🌿' },
    { id:'transport', label:'Transport Requests',  icon:'🚛' },
    { id:'deals',     label:'My Deals',            icon:'🤝' },
    { id:'storage',   label:'Storage Guide',       icon:'📦' },
  ]},

  transport: { color:'#E67E22', bg:'#CA6F1E', icon:'🚛', navItems: [
    { id:'dashboard', label:'Dashboard',           icon:'📊' },
    { id:'offers',    label:'Browse Requests',     icon:'📋' },
    { id:'myjobs',    label:'My Jobs',             icon:'🗓️' },
    { id:'failures',  label:'Report Failure',      icon:'⚠️' },
  ]},

  dealer:    { color:'#2471A3', bg:'#1A5276', icon:'🏪', navItems: [
    { id:'dashboard', label:'Dashboard',           icon:'📊' },
    { id:'browse',    label:'Browse Produce',      icon:'🛒' },
    { id:'mydeals',   label:'My Deals',            icon:'🤝' },
  ]},

  admin:     { color:'#8E44AD', bg:'#6C3483', icon:'⚙️', navItems: [
    { id:'dashboard', label:'Overview',            icon:'📊' },
    { id:'users',     label:'All Users',           icon:'👥' },
    { id:'products',  label:'All Produce',         icon:'🌿' },
    { id:'transport', label:'Transport',           icon:'🚛' },
    { id:'deals',     label:'Deals',               icon:'🤝' },
    { id:'failures',  label:'Failures',            icon:'⚠️' },
  ]},
};

function initApp() {
  document.getElementById('auth-page').style.display='none';
  document.getElementById('app').style.display='flex';
  const u = state.user;
  const cfg = ROLE_CFG[u.role];
  
  const avatar = u.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  document.getElementById('sidebar-user-info').innerHTML = `
    
  <div class="sidebar-user-avatar" style="background:${cfg.bg}">${avatar}</div>
    <div class="sidebar-user-name">${u.name}</div>
    <div class="sidebar-user-role" style="background:${cfg.color}22;color:${cfg.color};border:1px solid ${cfg.color}44">${cfg.icon} ${u.role.charAt(0).toUpperCase()+u.role.slice(1)}</div>
  `;

  // Sidebar nav
  document.getElementById('sidebar-nav').innerHTML = cfg.navItems.map(item=>`
    <div class="nav-item" id="nav-${item.id}" onclick="navigate('${item.id}')">
      <span class="nav-icon">${item.icon}</span>${item.label}
    </div>
  `).join('');

  // Topbar date
  document.getElementById('topbar-date').textContent = new Date().toLocaleDateString('en-BD',{weekday:'long',year:'numeric',month:'long',day:'numeric'});

  navigate(cfg.navItems[0].id);
}


function navigate(id) {
  
  state.activeNav = id;
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));
  const el = document.getElementById('nav-'+id);
  if(el) el.classList.add('active');
  const cfg = ROLE_CFG[state.user.role];
  const navItem = cfg.navItems.find(n=>n.id===id);
  document.getElementById('topbar-title').textContent = navItem?.label||'';
  const body = document.getElementById('page-body');
  body.innerHTML = '';

  const renders = {
    // FARMER
    
    farmer: { dashboard:renderFarmerDashboard, products:renderMyProducts, transport:renderTransportReqs, deals:renderFarmerDeals, storage:renderStorageGuide },
    // TRANSPORT
    
    transport: { dashboard:renderTransportDashboard, offers:renderBrowseRequests, myjobs:renderMyJobs, failures:renderFailures },
    // DEALER
    
    dealer: { dashboard:renderDealerDashboard, browse:renderBrowseProduce, mydeals:renderMyDeals },
    // ADMIN
    
    admin: { dashboard:renderAdminDashboard, users:renderAdminUsers, products:renderAdminProducts, transport:renderAdminTransport, deals:renderAdminDeals, failures:renderAdminFailures },
  };

  const fn = renders[state.user.role]?.[id];
  if(fn) fn();
}


// ──────────────────────────────────────────────────────────────────────────────
//  FARMER PAGES
// ──────────────────────────────────────────────────────────────────────────────
 
function renderFarmerDashboard() {
  const u = state.user;
  const myP = state.products.filter(p=>p.farmerId===u.id || p.farmer_id===u.id);
  const myT = state.trans.filter(t=>t.farmerId===u.id || t.farmer_id===u.id);
  const myD = state.deals.filter(d=>d.farmerId===u.id || d.farmer_id===u.id);
  const pending = myD.filter(d=>d.status==='Pending').length;
  document.getElementById('page-body').innerHTML = `
    
  <div class="hero-banner">
      <div class="inner">
        <h2>Good day, ${u.name}! ${ROLE_CFG.farmer.icon}</h2>
        <p>Track your harvest, manage storage conditions, and connect with logistics partners — all from one place.</p>
      </div>
    </div>
    <div class="stats-grid">

      <div class="stat-card green" data-icon="🌿"><div class="stat-value">${myP.length}</div><div class="stat-label">Listed Produce</div><div class="stat-sub">Items in market</div></div>
      <div class="stat-card gold" data-icon="🚛"><div class="stat-value">${myT.length}</div><div class="stat-label">Transport Requests</div><div class="stat-sub">${myT.filter(t=>t.status==='Open').length} open</div></div>
      <div class="stat-card forest" data-icon="🤝"><div class="stat-value">${myD.length}</div><div class="stat-label">Total Deals</div><div class="stat-sub">${myD.filter(d=>d.status==='Accepted').length} accepted</div></div>
      <div class="stat-card sage" data-icon="🔔"><div class="stat-value">${pending}</div><div class="stat-label">Pending Offers</div><div class="stat-sub">Awaiting response</div></div>
    </div>
   
    ${pending>0?`<div class="alert alert-warning">⚠️ You have <strong>${pending} pending deal offer(s)</strong> from dealers waiting for your response.</div>`:''}
    <div class="info-grid">
      <div class="card">
        <div class="card-header"><div class="card-title">📋 Recent Produce</div></div>
        <div style="overflow-x:auto">

        <table class="data-table">
          <thead><tr><th>Produce</th><th>Qty</th><th>Status</th><th>Fresh Days</th></tr></thead>
          <tbody>${myP.length?myP.slice(-4).reverse().map(p=>`<tr><td>${p.emoji||'🌿'} <strong>${p.name}</strong></td><td>${p.quantity} ${p.unit}</td><td>${badge(p.status)}</td><td>${p.freshDays} days</td></tr>`).join(''):'<tr><td colspan="4" style="text-align:center;color:#8FA8A0;padding:20px">No produce listed yet</td></tr>'}</tbody>
        </table></div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">🚛 Recent Transport</div></div>
        <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr><th>Product</th><th>Route</th><th>Status</th></tr></thead>
          <tbody>${myT.length?myT.slice(-4).reverse().map(t=>`<tr><td>${t.product}</td><td>${t.pickup}→${t.destination}</td><td>${badge(t.status)}</td></tr>`).join(''):'<tr><td colspan="3" style="text-align:center;color:#8FA8A0;padding:20px">No requests yet</td></tr>'}</tbody>
        </table></div>
      </div>

    </div>
  `;
}

function renderMyProducts() {
  const myP = state.products.filter(p => p.farmerId === state.user.id || p.farmer_id === state.user.id);
  document.getElementById('page-body').innerHTML = `
    <div class="section-header"><h2>My Produce</h2><button class="btn btn-primary" onclick="openAddProduct()">+ Add Produce</button></div>
    <div id="prod-alert"></div>
    ${myP.length === 0
      ? `<div class="card"><div class="empty-state"><div class="empty-icon">🌿</div><p>No produce listed yet. Add your first item!</p></div></div>`
      : `<div class="card"><div class="card-body table-wrap">
        <table class="data-table">
          <thead><tr><th>Produce</th><th>Category</th><th>Qty</th><th>Harvest Date</th><th>Location</th><th>Temp</th><th>Fresh Days</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>${myP.map(p => `<tr>
            <td>${p.emoji || '🌿'} <strong>${p.name}</strong></td>
            <td><span class="badge ${p.category === 'Fruit' ? 'badge-gold' : 'badge-green'}">${p.category}</span></td>
            <td>${p.quantity} ${p.unit}</td>
            <td>${p.harvestDate || p.harvest_date || ''}</td>
            <td>${p.location}</td>
            <td>${p.temp || ''}</td>
            <td>${p.freshDays || ''} days</td>
            <td>${badge(p.status)}</td>
            <td><button class="btn btn-sm" style="background:#C0392B;color:white" onclick=\"removeProduct('${p.id}')\">Remove</button></td>
          </tr>`).join('')}
          </tbody>
        </table>
      </div></div>`}
  `;
}

function openAddProduct() {
  
  const myP = state.products.filter(p=>p.farmerId===state.user.id);
  
openModal(`<div class="modal">
    <div class="modal-header"><span class="modal-title">🌿 Add New Produce</span><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      <div id="add-prod-alert"></div>
      
      <div class="form-group">
        <label class="form-label">Produce Type</label>
        <select class="form-control" id="ap-name" onchange="updateStorageTip()">
          <optgroup label="🍎 Fruits">${Object.entries(PRODUCE_DB).filter(([,v])=>v.cat==='Fruit').map(([k,v])=>`<option>${k}</option>`).join('')}</optgroup>
          <optgroup label="🥦 Vegetables">${Object.entries(PRODUCE_DB).filter(([,v])=>v.cat==='Vegetable').map(([k,v])=>`<option>${k}</option>`).join('')}</optgroup>
        
        
          </select>

      </div>
      <div id="storage-tip-box" class="storage-tip">💡 Recommended: 13–15°C · 85–90% humidity · Fresh for 14 days. Store away from ethylene-sensitive produce.</div>
      <div class="form-grid-2">
        <div class="form-group"><label class="form-label">Quantity</label><input class="form-control" id="ap-qty" type="number" placeholder="e.g. 500"></div>
        <div class="form-group"><label class="form-label">Unit</label>
          
        <select class="form-control" id="ap-unit"><option>kg</option><option>ton</option><option>pieces</option><option>crate</option></select>
        </div>
      </div>

      <div class="form-grid-2">
        
      <div class="form-group"><label class="form-label">Harvest Date</label><input class="form-control" type="date" id="ap-date" value="${today()}"></div>
        <div class="form-group"><label class="form-label">Storage Location</label><input class="form-control" id="ap-loc" placeholder="e.g. Rajshahi" value="${state.user.location||''}"></div>
      </div>
      <div class="form-group">
        <label class="form-label">Asking Price (৳/kg) <span style="color:var(--slate);font-weight:400">(Optional — visible to dealers)</span></label>
        <input class="form-control" id="ap-price" type="number" placeholder="e.g. 80">
      </div>
      <button class="btn btn-primary btn-full" onclick="submitAddProduct()">Add to Listing</button>
    </div>
  </div>`);
  
  updateStorageTip();
}

function updateStorageTip() {
  const name = document.getElementById('ap-name')?.value;
  const info = PRODUCE_DB[name];
  if(info && document.getElementById('storage-tip-box')) {
    document.getElementById('storage-tip-box').innerHTML = `💡 <strong>${name}:</strong> Store at ${info.temp} · ${info.humidity} humidity · Fresh for <strong>${info.freshDays} days</strong>.<br><em>${info.tips}</em>`;
  }
}
async function submitAddProduct() {
  const name=document.getElementById('ap-name').value;
  const qty=document.getElementById('ap-qty').value;
  const unit=document.getElementById('ap-unit').value;
  const date=document.getElementById('ap-date').value;
  const loc=document.getElementById('ap-loc').value;
  const price=document.getElementById('ap-price').value;

if(!qty||!date||!loc) return showAlert('add-prod-alert','All fields required.','danger');
  const info = PRODUCE_DB[name]||{};

  try {

    await apiFetch('/produce', { method:'POST', body: JSON.stringify({
      name, category: info.cat||'Other', quantity: Number(qty), unit,
      harvest_date: date, location: loc,
      storage_temp: info.temp||'', storage_humidity: info.humidity||'',
      fresh_days: info.freshDays||0, storage_tips: info.tips||'',
      expected_price_per_kg: price ? Number(price) : null

    })});

    closeModal();
    await refreshDataAndRender('products');
    showAlert('prod-alert','Produce added successfully!','success');
  } catch(e) {
    if (isDemo()) {
      const newProduct = {
        id:'prod'+Date.now(),
        farmerId: state.user.id,
        farmerName: state.user.name,
        name,
        category: info.cat||'Other',
        quantity: Number(qty),
        unit,
        harvestDate: date,
        location: loc,
        status:'Available',
        listed: today(),
        temp: info.temp||'',
        humidity: info.humidity||'',
        freshDays: info.freshDays||7,
        tips: info.tips||'',
        emoji: info.emoji||'*',
        expectedPrice: price ? Number(price) : null
      };
      state.products.push(newProduct);
      SEED_PRODUCTS.push(newProduct);
      closeModal();
      renderMyProducts();
      showAlert('prod-alert','Produce added locally!','success');
      return;
    }
    handleApiError(e, 'add-prod-alert', 'Failed to add produce.');
  }
}
async function removeProduct(id) {
  try {
    await apiFetch('/produce/'+id, { method:'DELETE' });
    await refreshDataAndRender('products');
    showAlert('prod-alert','Produce removed.','success');
  } 
  catch(e) {
    if (isDemo()) {
      state.products = state.products.filter(p=>String(p.id)!==String(id));
      renderMyProducts();
      showAlert('prod-alert','Produce removed locally!','success');
      return;
    }
    handleApiError(e, 'prod-alert', 'Failed to remove produce.');
  }
}

function renderTransportReqs() 
{
  const myT = state.trans.filter(t=>t.farmerId===state.user.id);
  const myP = state.products.filter(p=>p.farmerId===state.user.id);
  document.getElementById('page-body').innerHTML = `
     
  <div class="section-header"><h2>Transport Requests</h2><button class="btn btn-gold" onclick="openAddTransport()">+ New Request</button></div>
    <div id="trans-alert"></div>

   ${myT.length===0?`<div class="card"><div class="empty-state"><div class="empty-icon">🚛</div><p>No transport requests yet.</p></div></div>`:`
    <div class="card"><div class="card-body table-wrap">
    
    <table class="data-table">

      <thead><tr><th>Produce</th><th>Pickup</th><th>Destination</th><th>Date</th><th>Quantity</th><th>Transporter</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>${myT.map(t=>`<tr>
        <td>${produceEmoji(t.product)} <strong>${t.product}</strong></td>

        <td>📍${t.pickup}</td><td>📍${t.destination}</td><td>${t.date}</td><td>${t.quantity}</td>
        <td>${t.transporterName||'<span style="color:#8FA8A0">Unassigned</span>'}</td>
        <td>${badge(t.status)}</td>

        <td>${t.status==='Open'?`<button class="btn btn-sm" style="background:#C0392B;color:white" onclick="cancelTransport('${t.id}')">Cancel</button>`:'—'}</td>
      </tr>`).join('')}</tbody>

    </table></div></div>`}
  `;
}  
function openAddTransport() {
  const myP = state.products.filter(p=>p.farmerId===state.user.id || p.farmer_id===state.user.id);
  
  if (myP.length === 0) {
    openModal(`<div class="modal">
      <div class="modal-header"><span class="modal-title">🚛 New Transport Request</span><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="empty-state">
          <div class="empty-icon">🌿</div>
          <p>You need to add produce before creating a transport request.</p>
          <p style="margin-top:1rem"><button class="btn btn-primary" onclick="closeModal(); openAddProduct();">+ Add Produce First</button></p>
        </div>
      </div>
    </div>`);
    return;
  }

  openModal(`<div class="modal">
    <div class="modal-header"><span class="modal-title">🚛 New Transport Request</span><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      <div id="at-alert"></div>

      <div class="form-group"><label class="form-label">Select Produce</label>
        <select class="form-control" id="at-prod">
          <option value="">-- Select Produce --</option>
          ${myP.map(p=>`<option value="${p.id}" data-loc="${p.location}">${p.emoji||'🌿'} ${p.name} (${p.quantity} ${p.unit})</option>`).join('')}
        
        </select>

      </div>
      <div class="form-grid-2">
        <div class="form-group"><label class="form-label">Pickup Location</label><input class="form-control" id="at-pickup" placeholder="Auto from product"></div>
        <div class="form-group"><label class="form-label">Destination</label><input class="form-control" id="at-dest" placeholder="e.g. Dhaka Kawran Bazar"></div>
      </div>
      <div class="form-grid-2">
        <div class="form-group"><label class="form-label">Pickup Date</label><input class="form-control" type="date" id="at-date" value="${today()}"></div>
        <div class="form-group"><label class="form-label">Quantity</label><input class="form-control" id="at-qty" placeholder="e.g. 500 kg"></div>
     
      </div>
      <div class="form-group"><label class="form-label">Special Instructions</label><textarea class="form-control" id="at-notes" placeholder="e.g. Refrigerated vehicle required..."></textarea></div>
      <button class="btn btn-primary btn-full" onclick="submitTransport()">Submit Request</button>
    </div>
  </div>`);
  
  document.getElementById('at-prod').addEventListener('change', function() {
    const opt = this.options[this.selectedIndex];
    const loc = opt.getAttribute('data-loc');
    if(loc) document.getElementById('at-pickup').value = loc;
  });
}

async function submitTransport() {
   
  const prodId=document.getElementById('at-prod').value;
  const dest=document.getElementById('at-dest').value;
  if(!prodId||!dest) return showAlert('at-alert','Select produce and enter destination.','danger');
  
  const prod = state.products.find(p=>String(p.id)===String(prodId));
 
  try {
    await apiFetch('/transport', { method:'POST', body: JSON.stringify({
      product_id: Number(prodId), produce_name: prod?.name,
      pickup_location: document.getElementById('at-pickup').value||prod?.location,
      destination: dest, pickup_date: document.getElementById('at-date').value,
      quantity: document.getElementById('at-qty').value,
      notes: document.getElementById('at-notes').value
    })});

    closeModal();
    await refreshDataAndRender('transport');
    showAlert('trans-alert','Transport request submitted.','success');

  } 
  catch(e) {
    if (isDemo()) {
      const newTrans = {
        id:'trans'+Date.now(),
        farmerId: state.user.id,
        farmerName: state.user.name,
        product: prod?.name,
        productId: prodId,
        pickup: document.getElementById('at-pickup').value||prod?.location||'',
        destination: dest,
        date: document.getElementById('at-date').value,
        quantity: document.getElementById('at-qty').value,
        notes: document.getElementById('at-notes').value,
        status: 'Open',
        created: today()
      };
      state.trans.push(newTrans);
      SEED_TRANS.push(newTrans);
      closeModal();
      renderTransportReqs();
      showAlert('trans-alert','Transport request added locally!','success');
      return;
    }
    handleApiError(e, 'at-alert', 'Failed to submit transport request.');
  }
}
 async function cancelTransport(id) {

  try {
    await apiFetch('/transport/'+id, { method:'PATCH', body: JSON.stringify({ status:'Cancelled' }) });
    await refreshDataAndRender('transport');
    showAlert('trans-alert','Transport request cancelled.','success');
  } 
  catch(e) {
    if (isDemo()) {
      state.trans = state.trans.map(t=>String(t.id)===String(id)?{...t,status:'Cancelled'}:t);
      renderTransportReqs();
      showAlert('trans-alert','Transport cancelled locally!','success');
      return;
    }
    handleApiError(e, 'trans-alert', 'Failed to cancel transport request.');
  }
}

function renderFarmerDeals() 

{
  const myD = state.deals.filter(d=>d.farmerId===state.user.id);
 
  document.getElementById('page-body').innerHTML = `
    <div class="section-header"><h2>My Deals</h2></div>
    <div id="deal-alert"></div>

    ${myD.length===0?`<div class="card"><div class="empty-state"><div class="empty-icon">🤝</div><p>No deal offers yet. List your produce so dealers can find you!</p></div></div>`:`
    <div class="card"><div class="card-body table-wrap">
    <table class="data-table">

      <thead><tr><th>Dealer</th><th>Produce</th><th>Quantity</th><th>Your Ask</th><th>Offered</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${myD.map(d=>`<tr>
        <td><strong>${d.dealerName}</strong></td>

        <td>${produceEmoji(d.product)} ${d.product}</td>
        <td>${d.quantity}</td>
        <td>${d.expectedPrice ? '৳'+d.expectedPrice+'/kg' : '—'}</td>
        <td style="font-weight:600;color:${d.expectedPrice && d.price < d.expectedPrice ? 'var(--amber)' : 'var(--forest)'}">৳${d.price}/kg</td>
        <td>${d.created}</td>

        <td>${badge(d.status)}</td>
        <td>${d.status==='Pending'?`

          <button class="btn btn-sm btn-primary" onclick="respondDeal('${d.id}','Accepted')">Accept</button>
          <button class="btn btn-sm btn-danger" style="margin-left:5px" onclick="respondDeal('${d.id}','Declined')">Decline</button>`:'—'}
        </td>

      </tr>`).join('')}</tbody>

    </table></div></div>`}
  `;
}

async function respondDeal(id, status)
{
  try 
  {
    await apiFetch('/deals/'+id, { method:'PATCH', body: JSON.stringify({ status }) });
    await refreshDataAndRender('deals');
  } 
  catch(e) {
    if (isDemo()) {
      state.deals = state.deals.map(d=>String(d.id)===String(id)?{...d,status}:d);
      renderFarmerDeals();
      showAlert('deal-alert','Deal response saved locally!','success');
      return;
    }
    handleApiError(e, 'deal-alert', 'Failed to respond to deal.');
  }
}

function renderStorageGuide()
 {
  const fruits = Object.entries(PRODUCE_DB).filter(([,v])=>v.cat==='Fruit');
  const vegs   = Object.entries(PRODUCE_DB).filter(([,v])=>v.cat==='Vegetable');
  
  document.getElementById('page-body').innerHTML = `
    <div class="section-header"><h2>📦 Storage Guide</h2></div>
    <div class="hero-banner"><div class="inner"><h2>Storage Condition Reference</h2><p>Optimal conditions to minimize post-harvest losses for ${Object.keys(PRODUCE_DB).length} crops.</p></div></div>
    <h3 style="color:var(--forest);margin-bottom:1rem;font-family:'Lora',serif;">🍎 Fruits</h3>
    <div class="produce-grid" style="margin-bottom:2rem">${fruits.map(([name,info])=>produceCard(name,info)).join('')}</div>
    <h3 style="color:var(--forest);margin-bottom:1rem;font-family:'Lora',serif;">🥦 Vegetables</h3>
    <div class="produce-grid">${vegs.map(([name,info])=>produceCard(name,info)).join('')}</div>
  `;
}

function produceCard(name, info) {

  return `<div class="produce-card">

    <div class="produce-card-header" style="background:${info.cat==='Fruit'?'linear-gradient(135deg,#FEF9E7,#FDEBD0)':'linear-gradient(135deg,#E9F7EF,#D5F5E3)'}">
      <span class="produce-emoji">${info.emoji}</span>
      <div class="produce-name">${name}</div>
      <div class="produce-meta">${info.cat} · ${info.harvestMonths}</div>
    </div>

    <div class="produce-card-body">

      <div class="produce-info-row"><span class="produce-info-label">🌡️ Temperature</span><span class="produce-info-val">${info.temp}</span></div>
      <div class="produce-info-row"><span class="produce-info-label">💧 Humidity</span><span class="produce-info-val">${info.humidity}</span></div>
      <div class="produce-info-row"><span class="produce-info-label">🗓️ Fresh Duration</span><span class="produce-info-val">${info.freshDays} days</span></div>
      <div class="storage-tip" style="margin-top:8px;margin-bottom:0">${info.tips}</div>
    </div>

  </div>`;
}
// ──────────────────────────────────────────────────────────────────────────────
//  TRANSPORT PAGES
// ──────────────────────────────────────────────────────────────────────────────

function renderTransportDashboard()
 {

  const u = state.user;
  const myJobs = state.trans.filter(t=>t.assignedTo===u.id);
  const myFail = state.failures.filter(f=>f.transporterId===u.id);

  document.getElementById('page-body').innerHTML = `
    <div class="hero-banner" style="background:linear-gradient(135deg,#7E5109,#CA6F1E,#E67E22)">

      <div class="inner"><h2>Welcome, ${u.name}! 🚛</h2><p>Browse open transport requests, accept jobs, and manage your deliveries efficiently.</p></div>
    </div>

    <div class="stats-grid">

      <div class="stat-card green" data-icon="📋"><div class="stat-value">${state.trans.filter(t=>t.status==='Open').length}</div><div class="stat-label">Open Requests</div><div class="stat-sub">Available to accept</div></div>
      <div class="stat-card gold" data-icon="🗓️"><div class="stat-value">${myJobs.filter(j=>j.status==='Accepted').length}</div><div class="stat-label">Active Jobs</div><div class="stat-sub">In progress</div></div>
      <div class="stat-card forest" data-icon="✅"><div class="stat-value">${myJobs.filter(j=>j.status==='Completed').length}</div><div class="stat-label">Completed</div><div class="stat-sub">Delivered</div></div>
      <div class="stat-card sage" data-icon="⚠️"><div class="stat-value">${myFail.length}</div><div class="stat-label">Failures Reported</div><div class="stat-sub">Incidents</div></div>
    </div>

    <div class="card">

      <div class="card-header"><div class="card-title">🔥 Open Requests Nearby</div><button class="btn btn-sm btn-primary" onclick="navigate('offers')">View All</button></div>
      <div class="card-body table-wrap">

      <table class="data-table">

        <thead><tr><th>Farmer</th><th>Produce</th><th>Route</th><th>Date</th><th>Action</th></tr></thead>
        <tbody>${state.trans.filter(t=>t.status==='Open').slice(0,5).map(t=>`<tr>
          <td>${t.farmerName}</td><td>${produceEmoji(t.product)} ${t.product}</td>
          <td>${t.pickup} → ${t.destination}</td><td>${t.date}</td>

          <td><button class="btn btn-sm btn-primary" onclick="acceptJob('${t.id}')">Accept</button></td>
        </tr>`).join('')||'<tr><td colspan="5" style="text-align:center;color:#8FA8A0;padding:20px">No open requests</td></tr>'}</tbody>
      </table></div>
    </div>
  `;
}

function renderBrowseRequests()
 {
  const open = state.trans.filter(t=>t.status==='Open');
  document.getElementById('page-body').innerHTML = `
    <div class="section-header"><h2>Browse Requests</h2></div>

    <div id="offer-alert"></div>
    ${open.length===0?`<div class="card"><div class="empty-state"><div class="empty-icon">📋</div><p>No open requests at the moment.</p></div></div>`:`
    <div class="card"><div class="card-body table-wrap">
    <table class="data-table">

      <thead><tr><th>Farmer</th><th>Produce</th><th>Pickup</th><th>Destination</th><th>Date</th><th>Qty</th><th>Notes</th><th>Action</th></tr></thead>
      <tbody>${open.map(t=>`<tr>
        <td><strong>${t.farmerName}</strong></td>
        <td>${produceEmoji(t.product)} ${t.product}</td>
        <td>📍${t.pickup}</td><td>📍${t.destination}</td>

        <td>${t.date}</td><td>${t.quantity}</td>
        <td style="max-width:150px;font-size:.8rem;color:var(--slate)">${t.notes||'—'}</td>
        <td><button class="btn btn-sm btn-primary" onclick="acceptJob('${t.id}')">✓ Accept</button></td>
      </tr>`).join('')}</tbody>

    </table></div></div>`}
  `;
}

async function acceptJob(id) {
  try {
    await apiFetch('/transport/'+id, { method:'PATCH', body: JSON.stringify({ status:'Accepted' }) });
    await refreshDataAndRender(state.activeNav || 'offers');
    showAlert('offer-alert','Job accepted.','success');
  } catch(e) {
    if (isDemo()) {
      state.trans = state.trans.map(t=>String(t.id)===String(id)?{...t,status:'Accepted',assignedTo:state.user.id,transporterName:state.user.name}:t);
      renderBrowseRequests();
      showAlert('offer-alert','Job accepted locally!','success');
      return;
    }
    handleApiError(e, 'offer-alert', 'Failed to accept job.');
  }
}

function renderMyJobs() 
{
  const mine = state.trans.filter(t=>t.assignedTo===state.user.id);
  document.getElementById('page-body').innerHTML = `
    <div class="section-header"><h2>My Jobs</h2></div>

    <div id="job-alert"></div>
    ${mine.length===0?`<div class="card"><div class="empty-state"><div class="empty-icon">🗓️</div><p>No accepted jobs yet. Browse open requests.</p></div></div>`:`
    <div class="card"><div class="card-body table-wrap">
    <table class="data-table">

      <thead><tr><th>Produce</th><th>Route</th><th>Date</th><th>Qty</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>${mine.map(t=>`<tr>
        <td>${produceEmoji(t.product)} <strong>${t.product}</strong></td>
        <td>${t.pickup} → ${t.destination}</td>
        <td>${t.date}</td><td>${t.quantity}</td>

        <td>${badge(t.status)}</td>
        <td>${t.status==='Accepted'?`<button class="btn btn-sm btn-primary" onclick="completeJob('${t.id}')">✓ Delivered</button>`:'—'}</td>
      </tr>`).join('')}</tbody>
    </table></div></div>`}
  `;
}

async function completeJob(id) {
  try {
    await apiFetch('/transport/'+id, { method:'PATCH', body: JSON.stringify({ status:'Completed' }) });
    await refreshDataAndRender(state.activeNav || 'myjobs');
    showAlert('job-alert','Job completed.','success');
  } catch(e) {
    if (isDemo()) {
      state.trans = state.trans.map(t=>String(t.id)===String(id)?{...t,status:'Completed'}:t);
      renderMyJobs();
      showAlert('job-alert','Job completed locally!','success');
      return;
    }
    handleApiError(e, 'job-alert', 'Failed to complete job.');
  }
}

function renderFailures() {
  const myFail = state.failures.filter(f=>f.transporterId===state.user.id);
  const myJobs = state.trans.filter(t=>t.assignedTo===state.user.id && t.status==='Accepted');

  document.getElementById('page-body').innerHTML = `
    <div class="section-header"><h2>Delivery Failures</h2><button class="btn btn-gold" onclick="openReportFailure()">⚠️ Report Failure</button></div>
    <div id="fail-alert"></div>
    ${myFail.length===0?`<div class="card"><div class="empty-state"><div class="empty-icon">✅</div><p>No failures reported. Keep up the good work!</p></div></div>`:''}
    ${myFail.map(f=>`
      <div class="failure-card">

        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <div style="font-weight:700;color:var(--amber);font-size:1.05rem">${produceEmoji(f.product)} ${f.product}</div>
            <div style="font-size:.85rem;color:var(--slate);margin-top:3px">Route: ${f.route} · ${f.reported}</div>
            <div style="font-size:.85rem;margin-top:5px"><strong>Reason:</strong> ${f.reason}</div>
            ${f.notes?`<div style="font-size:.82rem;color:var(--slate);margin-top:3px;font-style:italic">"${f.notes}"</div>`:''}
          </div>
          <span class="badge badge-gold">Failure Reported</span>

        </div>
        <div class="alternatives-box">
          <h4>🔄 Suggested Alternative Actions</h4>
          ${f.alternatives.map(a=>`<div class="alt-item">${a}</div>`).join('')}
        </div>
      </div>
    `).join('')}
  `;
}

const FAIL_REASONS = ['Vehicle breakdown','Road flooded / blocked','Driver unavailable','Fuel shortage','Accident','Extreme weather','Customs/checkpoint delay','Other'];
const ALTERNATIVES = [
  'Redirect to nearest government cold storage facility',
  'Contact alternate registered transport provider in the area',
  'Sell to local market or wholesaler to avoid total loss',
  'Split consignment — partial delivery via alternate route',
  'Refrigerated holding at origin until transport resumes',
  'Coordinate with district agricultural officer for emergency logistics',
  'Use rail freight as alternative if available on route',
];

function openReportFailure() {
  const jobs = state.trans.filter(t=>String(t.assignedTo)===String(state.user.id) && t.status==='Accepted');
  
  if (jobs.length === 0) {
    openModal(`<div class="modal">
      <div class="modal-header"><span class="modal-title">⚠️ Report Delivery Failure</span><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="empty-state">
          <div class="empty-icon">🚛</div>
          <p>You need to have an accepted job before reporting a failure.</p>
          <p style="margin-top:1rem"><button class="btn btn-primary" onclick="closeModal(); navigate('offers');">Browse Requests</button></p>
        </div>
      </div>
    </div>`);
    return;
  }
  
  openModal(`<div class="modal">

    <div class="modal-header"><span class="modal-title">⚠️ Report Delivery Failure</span><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body">
      <div id="rf-alert"></div>
      <div class="form-group"><label class="form-label">Select Job</label>
        <select class="form-control" id="rf-job">
          <option value="">-- Select Active Job --</option>

          ${jobs.map(j=>`<option value="${j.id}">${j.product} — ${j.pickup} → ${j.destination}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Failure Reason</label>
        <select class="form-control" id="rf-reason">

          <option value="">-- Select Reason --</option>
          ${FAIL_REASONS.map(r=>`<option>${r}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Additional Details</label><textarea class="form-control" id="rf-notes" placeholder="Describe what happened and your current situation..."></textarea></div>
      <button class="btn btn-gold btn-full" onclick="submitFailure()">Submit Failure Report</button>
    </div>
  </div>`);
}

async function submitFailure() 
{
  const jobId = document.getElementById('rf-job').value;

  const reason = document.getElementById('rf-reason').value;
  if(!jobId||!reason) return showAlert('rf-alert','Please select a job and reason.','danger');
  const job = state.trans.find(t=>String(t.id)===String(jobId));
  const alts = ALTERNATIVES.filter(()=>Math.random()>.3).slice(0,4);

  try {
    await apiFetch('/failures', { method:'POST', body: JSON.stringify({
      transport_request_id: jobId, produce_name: job?.product,
      route: `${job?.pickup} -> ${job?.destination}`,
      reason, notes: document.getElementById('rf-notes').value, alternatives: alts
    })});

    closeModal();
    await refreshDataAndRender('failures');
    showAlert('fail-alert','Failure report submitted.','success');
  }
   catch(e) {
    if (isDemo()) {
      const newFail = {
        id:'fail'+Date.now(),
        transporterId: state.user.id,
        transporterName: state.user.name,
        requestId: jobId,
        product: job?.product,
        route: `${job?.pickup} -> ${job?.destination}`,
        reason: reason,
        notes: document.getElementById('rf-notes').value,
        alternatives: alts,
        reported: today()
      };
      state.failures.push(newFail);
      state.trans = state.trans.map(t=>String(t.id)===String(jobId)?{...t,status:'Failed'}:t);
      closeModal();
      renderFailures();
      showAlert('fail-alert','Failure report saved locally!','success');
      return;
    }
    handleApiError(e, 'rf-alert', 'Failed to report failure.');
  }
}

//  DEALER PAGES
// ──────────────────────────────────────────────────────────────────────────────

function renderDealerDashboard() {

  const u = state.user;

  const myD = state.deals.filter(d=>d.dealerId===u.id);
  const avail = state.products.filter(p=>p.status==='Available');
  const avgPrice = myD.length > 0 ? (myD.reduce((sum, d) => sum + (d.price || 0), 0) / myD.length).toFixed(1) : 0;

  document.getElementById('page-body').innerHTML = `
    <div class="hero-banner" style="background:linear-gradient(135deg,#1A5276,#2471A3,#2980B9)">
      <div class="inner"><h2>Welcome, ${u.name}! 🏪</h2><p>Discover fresh produce from farmers across Bangladesh. Make deals and build direct supply chains.</p></div>
    </div>
    <div class="stats-grid">
      <div class="stat-card green" data-icon="🛒"><div class="stat-value">${avail.length}</div><div class="stat-label">Available Items</div><div class="stat-sub">Ready to buy</div></div>
      <div class="stat-card gold" data-icon="🤝"><div class="stat-value">${myD.length}</div><div class="stat-label">Total Deals</div><div class="stat-sub">All time</div></div>
      <div class="stat-card forest" data-icon="✅"><div class="stat-value">${myD.filter(d=>d.status==='Accepted').length}</div><div class="stat-label">Accepted Deals</div><div class="stat-sub">Confirmed</div></div>
      <div class="stat-card sage" data-icon="💰"><div class="stat-value">৳${avgPrice}</div><div class="stat-label">Avg Offered</div><div class="stat-sub">Per kg average</div></div>
    </div>
    ${myD.filter(d=>d.status==='Pending').length > 0 ? `<div class="alert alert-info">⏳ You have <strong>${myD.filter(d=>d.status==='Pending').length} pending offer(s)</strong> awaiting farmer response.</div>` : ''}
    <div class="card">
      <div class="card-header"><div class="card-title">🌟 Featured Produce</div><button class="btn btn-sm btn-primary" onclick="navigate('browse')">Browse All</button></div>
      <div class="produce-grid" style="padding:1.5rem;gap:1rem;">
       
      ${avail.slice(0,6).map(p=>`
          <div class="produce-card" onclick="openDealModal('${p.id}')" style="cursor:pointer">
            <div class="produce-card-header" style="background:${p.category==='Fruit'?'linear-gradient(135deg,#FEF9E7,#FDEBD0)':'linear-gradient(135deg,#E9F7EF,#D5F5E3)'}">
              <span class="badge ${p.category==='Fruit'?'badge-gold':'badge-green'}" style="position:absolute;top:10px;left:12px">${p.category}</span>
              
              <span class="produce-emoji">${p.emoji||'🌿'}</span>
              <div class="produce-name">${p.name}</div>
              <div class="produce-meta">by ${p.farmerName} · ${p.location}</div>
           
              </div>
            
              <div class="produce-card-body">
              <div class="produce-info-row"><span class="produce-info-label">📦 Stock</span><span class="produce-info-val">${p.quantity} ${p.unit}</span></div>
              ${p.expectedPrice ? `<div class="produce-info-row" style="background:var(--foam);padding:4px 6px;border-radius:4px"><span class="produce-info-label">💰 Ask</span><span class="produce-info-val" style="font-weight:600">৳${p.expectedPrice}/kg</span></div>` : ''}
              <div class="produce-info-row"><span class="produce-info-label">🗓️ Fresh for</span><span class="produce-info-val">${p.freshDays} days</span></div>
              <div style="margin-top:10px"><button class="btn btn-gold btn-full">Make Offer</button></div>
            
              </div>
          </div>
       
          `).join('')||'<p style="color:var(--mist);padding:1rem">No produce available.</p>'}
     
          </div>
    </div>
  `;
}


function renderBrowseProduce() {
  
  const avail = state.products.filter(p=>p.status==='Available');
 
  document.getElementById('page-body').innerHTML = `
   
  <div class="section-header"><h2>Browse Produce</h2>
    
    <div style="display:flex;gap:8px">
       
      <select class="form-control" id="filter-cat" onchange="filterProduce()" style="width:auto;padding:8px 14px">
          <option value="">All Categories</option><option>Fruit</option><option>Vegetable</option>
       
          </select>
      </div>
    </div>
   
    <div id="deal-alert"></div>
    <div id="produce-grid" class="produce-grid">
     
    ${avail.map(p=>produceCardDealer(p)).join('')}
    </div>
   
    ${avail.length===0?`<div class="card"><div class="empty-state"><div class="empty-icon">🛒</div><p>No produce available right now.</p></div></div>`:''}
  `;
}

function filterProduce() 
{
  const cat = document.getElementById('filter-cat')?.value;
  const avail = state.products.filter(p=>p.status==='Available' && (!cat||p.category===cat));
  const grid = document.getElementById('produce-grid');
 
  if(grid) grid.innerHTML = avail.map(p=>produceCardDealer(p)).join('');
}

function produceCardDealer(p) 
{

  const priceDisplay = p.expectedPrice ? `<div class="produce-info-row" style="background:var(--ivory);padding:6px 8px;border-radius:4px;margin-top:4px"><span class="produce-info-label" style="color:var(--forest)">💰 Farmer's Ask</span><span class="produce-info-val" style="color:var(--forest);font-weight:600">৳${p.expectedPrice}/kg</span></div>` : '';

  return `<div class="produce-card">

    <div class="produce-card-header" style="background:${p.category==='Fruit'?'linear-gradient(135deg,#FEF9E7,#FDEBD0)':'linear-gradient(135deg,#E9F7EF,#D5F5E3)'}">
      <span class="badge ${p.category==='Fruit'?'badge-gold':'badge-green'}" style="position:absolute;top:10px;left:12px">${p.category}</span>
      <span class="produce-emoji">${p.emoji||'🌿'}</span>
      <div class="produce-name">${p.name}</div>
      <div class="produce-meta">by ${p.farmerName} · 📍${p.location}</div>

    </div>

    <div class="produce-card-body">

      <div class="produce-info-row"><span class="produce-info-label">📦 Available</span><span class="produce-info-val">${p.quantity} ${p.unit}</span></div>
      ${priceDisplay}
      <div class="produce-info-row"><span class="produce-info-label">🌡️ Storage</span><span class="produce-info-val">${p.temp}</span></div>
      <div class="produce-info-row"><span class="produce-info-label">🗓️ Fresh for</span><span class="produce-info-val">${p.freshDays} days</span></div>
      <div class="produce-info-row"><span class="produce-info-label">📅 Harvested</span><span class="produce-info-val">${p.harvestDate}</span></div>
      <div style="margin-top:12px"><button class="btn btn-gold btn-full" onclick="openDealModal('${p.id}')">🤝 Make Offer</button></div>
    </div>

  </div>`;
}

function openDealModal(productId) 
{
  const p = state.products.find(pr=>pr.id===productId);

  if(!p) return;

  openModal(`<div class="modal">

    <div class="modal-header"><span class="modal-title">🤝 Make Deal Offer</span><button class="modal-close" onclick="closeModal()">✕</button></div>
    <div class="modal-body">

      <div style="background:var(--foam);border-radius:var(--radius-sm);padding:1rem;margin-bottom:1rem;border:1.5px solid var(--mint)">
        <div style="font-size:2rem">${p.emoji||'🌿'}</div>
        <div style="font-weight:700;font-size:1.1rem;color:var(--forest)">${p.name}</div>
        <div style="font-size:.85rem;color:var(--slate);margin-top:3px">by ${p.farmerName} · ${p.location} · ${p.quantity} ${p.unit} available</div>
        <div style="margin-top:8px;font-size:.82rem;color:var(--green)">${p.tips}</div>
      </div>

      <div id="dm-alert"></div>
      <div class="form-grid-2">
        <div class="form-group"><label class="form-label">Quantity Wanted</label><input class="form-control" id="dm-qty" type="number" placeholder="kg / units"></div>
        <div class="form-group"><label class="form-label">Offered Price (৳/kg)</label><input class="form-control" id="dm-price" type="number" placeholder="e.g. 75"></div>
      </div>

     
      <div class="form-group"><label class="form-label">Message to Farmer (optional)</label><textarea class="form-control" id="dm-msg" placeholder="Any special requirements..."></textarea></div>
      <button class="btn btn-gold btn-full" onclick="submitDeal('${productId}')">Send Offer to Farmer</button>
    </div>

  </div>`);
}

async function submitDeal(productId) 
{
  const qty=document.getElementById('dm-qty').value;
  const price=document.getElementById('dm-price').value;
 
  if(!qty||!price) return showAlert('dm-alert','Enter quantity and price.','danger');
  
  const p = state.products.find(pr=>String(pr.id)===String(productId));

  try 
  {
    await apiFetch('/deals', { method:'POST', body: JSON.stringify({
      
      farmer_id: p.farmerId, farmer_name: p.farmerName,
      product_id: productId, produce_name: p.name,
      quantity_requested: qty+' '+p.unit,
      offered_price_per_kg: Number(price),
      message: document.getElementById('dm-msg').value

    })});

    closeModal();
    await refreshDataAndRender(state.activeNav || 'browse');
    showAlert('deal-alert','Offer sent successfully to the farmer!','success');
  }
  
  catch(e)
   {
    if (isDemo()) {
      const newDeal = {
        id:'deal'+Date.now(),
        dealerId: state.user.id,
        dealerName: state.user.name,
        farmerId: p.farmerId,
        farmerName: p.farmerName,
        product: p.name,
        productId: productId,
        quantity: qty+' '+p.unit,
        price: Number(price),
        msg: document.getElementById('dm-msg').value,
        status: 'Pending',
        created: today()
      };
      state.deals.push(newDeal);
      SEED_DEALS.push(newDeal);
      closeModal();
      showAlert('deal-alert','Offer saved locally!','success');
      return;
    }
    handleApiError(e, 'dm-alert', 'Failed to send offer.');
   }
}

function renderMyDeals() 
{
  const myD = state.deals.filter(d=>d.dealerId===state.user.id);

  document.getElementById('page-body').innerHTML = `
    <div class="section-header"><h2>My Deals</h2></div>
    
    ${myD.length===0?`<div class="card"><div class="empty-state"><div class="empty-icon">🤝</div><p>No deals yet. Browse produce and send offers!</p></div></div>`:`
    <div class="card"><div class="card-body table-wrap">

    <table class="data-table">
      <thead><tr><th>Produce</th><th>Farmer</th><th>Qty Requested</th><th>Farmer Ask</th><th>Your Offer</th><th>Date</th><th>Status</th></tr></thead>
      <tbody>${myD.map(d=>`<tr>

        <td>${produceEmoji(d.product)} <strong>${d.product}</strong></td>
        <td>${d.farmerName}</td><td>${d.quantity}</td>
        <td>${d.expectedPrice ? '৳'+d.expectedPrice+'/kg' : '—'}</td>
        <td style="font-weight:600">৳${d.price}/kg</td>
        <td>${d.created}</td><td>${badge(d.status)}</td>
      </tr>`).join('')}</tbody>

    </table></div></div>`}
  `;
}

// ──────────────────────────────────────────────────────────────────────────────
//  ADMIN PAGES
// ──────────────────────────────────────────────────────────────────────────────

function renderAdminDashboard() 
{
  const total = { users:state.users.length, products:state.products.length, trans:state.trans.length, deals:state.deals.length, failures:state.failures.length };
  const byRole = r => state.users.filter(u=>u.role===r).length;
  document.getElementById('page-body').innerHTML = `
    <div class="hero-banner" style="background:linear-gradient(135deg,#4A235A,#6C3483,#8E44AD)">

      <div class="inner"><h2>Admin Overview ⚙️</h2><p>System-wide monitoring across all users, produce listings, logistics, and deals.</p></div>
    </div>


    <div class="stats-grid">
      <div class="stat-card green" data-icon="👥"><div class="stat-value">${total.users}</div><div class="stat-label">Total Users</div></div>
      <div class="stat-card gold" data-icon="🌿"><div class="stat-value">${total.products}</div><div class="stat-label">Produce Listed</div></div>
      <div class="stat-card forest" data-icon="🚛"><div class="stat-value">${total.trans}</div><div class="stat-label">Transport Requests</div></div>
      <div class="stat-card sage" data-icon="🤝"><div class="stat-value">${total.deals}</div><div class="stat-label">Deals</div></div>
    </div>

    <div class="info-grid">

      <div class="card">
        <div class="card-header"><div class="card-title">👥 Users by Role</div></div>

        <div class="card-body">

          ${[['🌾 Farmers','farmer','green'],['🚛 Transport','transport','gold'],['🏪 Dealers','dealer','blue'],['⚙️ Admins','admin','gray']].map(([label,role,color])=>`
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--ivory)">
              <span style="font-weight:600">${label}</span>

              <span class="badge badge-${color}">${byRole(role)}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">

        <div class="card-header"><div class="card-title">📊 Activity Summary</div></div>
        <div class="card-body">
          ${[['Open Transport Requests', state.trans.filter(t=>t.status==='Open').length,'blue'],

             ['Active Deliveries', state.trans.filter(t=>t.status==='Accepted').length,'green'],
             ['Pending Deals', state.deals.filter(d=>d.status==='Pending').length,'gold'],

             ['Delivery Failures', state.failures.length,'red']].map(([label,val,color])=>`
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--ivory)">
              <span style="font-weight:600">${label}</span>

              <span class="badge badge-${color}">${val}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    ${state.failures.length>0?`<div class="alert alert-warning">⚠️ ${state.failures.length} delivery failure(s) reported. Review in the Failures section.</div>`:''}
  `;
}

async function renderAdminUsers() {
  
  try {
    if (state.token && state.token !== 'demo-token') {
      const users = await apiFetch('/users');
      state.users = users.map(normUser);
    }
  } catch (err) {
    console.warn('Could not refresh users list:', err);
   
  }

  
  document.getElementById('page-body').innerHTML = `
    <div class="section-header"><h2>All Users (${state.users.length})</h2></div>

    <div class="card"><div class="card-body table-wrap">

    <table class="data-table">
      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Location/Vehicle</th><th>Joined</th></tr></thead>
      <tbody>${state.users.map(u=>`<tr>
        <td><strong>${u.name}</strong></td><td>${u.email}</td>

        <td><span class="badge ${{admin:'badge-gray',farmer:'badge-green',transport:'badge-gold',dealer:'badge-blue'}[u.role]||'badge-gray'}">${{admin:'⚙️',farmer:'🌾',transport:'🚛',dealer:'🏪'}[u.role]||''} ${u.role}</span></td>
        <td>${u.location||u.vehicle||'—'}</td><td>${u.joined}</td>

      </tr>`).join('')}</tbody>

    </table></div></div>

  `;
}

function renderAdminProducts() 
{

  document.getElementById('page-body').innerHTML = `
    <div class="section-header"><h2>All Produce (${state.products.length})</h2></div>

    <div class="card"><div class="card-body table-wrap">
    <table class="data-table">

      <thead><tr><th>Produce</th><th>Category</th><th>Farmer</th><th>Qty</th><th>Location</th><th>Storage Temp</th><th>Fresh Days</th><th>Status</th></tr></thead>
      <tbody>${state.products.map(p=>`<tr>

        <td>${p.emoji||'🌿'} <strong>${p.name}</strong></td>

        <td><span class="badge ${p.category==='Fruit'?'badge-gold':'badge-green'}">${p.category}</span></td>

        <td>${p.farmerName}</td><td>${p.quantity} ${p.unit}</td>

        <td>${p.location}</td><td>${p.temp}</td><td>${p.freshDays}d</td>

        <td>${badge(p.status)}</td>

      </tr>`).join('')}</tbody>

    </table></div></div>
  `;
}


function renderAdminTransport() {

  document.getElementById('page-body').innerHTML = `
    <div class="section-header"><h2>All Transport Requests (${state.trans.length})</h2></div>

    <div class="card"><div class="card-body table-wrap">
    
    <table class="data-table">
      
    <thead><tr><th>Farmer</th><th>Produce</th><th>Route</th><th>Date</th><th>Qty</th><th>Transporter</th><th>Status</th></tr></thead>
      
    <tbody>${state.trans.map(t=>`<tr>

        <td>${t.farmerName}</td>

        <td>${produceEmoji(t.product)} ${t.product}</td>
        <td>${t.pickup} → ${t.destination}</td>

        <td>${t.date}</td><td>${t.quantity}</td>

        <td>${t.transporterName||'<span style="color:var(--mist)">Unassigned</span>'}</td>

        <td>${badge(t.status)}</td>
     
        </tr>`).join('')}</tbody>

    </table></div></div>
  `;
}

function renderAdminDeals() {
  
  document.getElementById('page-body').innerHTML = `
    
  <div class="section-header"><h2>All Deals (${state.deals.length})</h2></div>
    <div class="card"><div class="card-body table-wrap">
    <table class="data-table">
     
    <thead><tr><th>Produce</th><th>Farmer</th><th>Dealer</th><th>Qty</th><th>Price</th><th>Date</th><th>Status</th></tr></thead>
     
    <tbody>${state.deals.map(d=>`<tr>

        <td>${produceEmoji(d.product)} ${d.product}</td>
        <td>${d.farmerName}</td><td>${d.dealerName}</td>
        <td>${d.quantity}</td><td>৳${d.price}/kg</td>
        <td>${d.created}</td><td>${badge(d.status)}</td>

      </tr>`).join('')}</tbody>

    </table></div></div>
  `;
}

function renderAdminFailures() {

  document.getElementById('page-body').innerHTML = `
    
  <div class="section-header"><h2>Delivery Failures (${state.failures.length})</h2></div>
    
  ${state.failures.length===0?`<div class="card"><div class="empty-state"><div class="empty-icon">✅</div><p>No delivery failures reported.</p></div></div>`:''}
    
  ${state.failures.map(f=>`
      
    <div class="failure-card">
       
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
          
    <div>

            <div style="font-weight:700;color:var(--amber);font-size:1.05rem">${produceEmoji(f.product)} ${f.product}</div>
            <div style="font-size:.85rem;color:var(--slate);margin-top:3px">🚛 ${f.transporterName} · Route: ${f.route}</div>
            <div style="font-size:.85rem;margin-top:5px"><strong>Reason:</strong> ${f.reason} · <strong>Date:</strong> ${f.reported}</div>
            ${f.notes?`<div style="font-size:.82rem;color:var(--slate);margin-top:3px;font-style:italic">"${f.notes}"</div>`:''}
          
            </div>

          <span class="badge badge-gold">Failure</span>

        </div>

        <div class="alternatives-box">
          <h4>🔄 Alternatives Suggested</h4>
          ${f.alternatives.map(a=>`<div class="alt-item">${a}</div>`).join('')}
        </div>
      </div>

    `).join('')}

  `;
}

// Init date

document.getElementById('topbar-date') && (document.getElementById('topbar-date').textContent = new Date().toLocaleDateString('en-BD',{weekday:'long',year:'numeric',month:'long',day:'numeric'}));

(async function restoreSession() {
  try {
    const token   = localStorage.getItem('hl_token');
    const userRaw = localStorage.getItem('hl_user');
    if (!token || !userRaw) return;

    state.token = token;
    state.user  = normUser(JSON.parse(userRaw));

    if (token === 'demo-token') {
      loadDemoData();
      initApp();
      return;
    }

    // Real token -> validate and reload
    try {
      showAlert('auth-alert','Restoring session...','info');
      const me = await apiFetch('/users/me');
      state.user = normUser(me);
      await loadAll();
      initApp();
    } catch (err) {
      localStorage.removeItem('hl_token');
      localStorage.removeItem('hl_user');
      state.token = null;
      state.user  = null;
      const msg = (err && err.message && err.message.toLowerCase().includes('network'))
        ? 'Unable to reach server. Please sign in again when online.'
        : 'Session expired. Please sign in again.';
      showAlert('auth-alert', msg, 'danger');
    }
  } catch (e) {
    console.warn('restoreSession error', e);
  }
})();
