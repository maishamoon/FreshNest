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

const API_BASE = 'http://localhost:5000/api';

function today() { return new Date().toISOString().slice(0,10); }
async function apiFetch(path, opts = {}) {
  
  const headers = { 'Content-Type': 'application/json' };
  
  if (state.token) headers['Authorization'] = 'Bearer ' + state.token;
  const res = await fetch(API_BASE + path, { ...opts, headers: { ...headers, ...(opts.headers||{}) } });
  let data;
  
  try {
    data = await res.json();
  } catch (err) {
    const text = await res.text();
    data = { error: text };
  }

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data.data;
}

/ ─── DATA NORMALIZERS ─────────────────────────────────────────────────────────


function normUser(u)    { return { ...u, vehicle: u.vehicle_type||'', joined: (u.created_at||'').slice(0,10) }; }
function normProduce(p) {
  const db = PRODUCE_DB[p.name] || {};
  return { ...p, farmerId: p.farmer_id, farmerName: p.farmer_name,
    harvestDate: p.harvest_date, temp: p.storage_temp||db.temp||'',
    humidity: p.storage_humidity||db.humidity||'', freshDays: p.fresh_days||db.freshDays||7,
    tips: p.storage_tips||db.tips||'', listed: (p.listed_at||'').slice(0,10),
    emoji: p.emoji||db.emoji||'🌿', category: p.category||db.cat||'Other' };
}

function normTrans(t)   { return { ...t, farmerId: t.farmer_id, farmerName: t.farmer_name,
    product: t.produce_name, productId: t.product_id, pickup: t.pickup_location,
    date: t.pickup_date, assignedTo: t.assigned_to, transporterName: t.transporter_name,
    created: (t.created_at||'').slice(0,10) }; }
    
    function normDeal(d)    { return { ...d, dealerId: d.dealer_id, dealerName: d.dealer_name,
    farmerId: d.farmer_id, farmerName: d.farmer_name, product: d.produce_name,
    productId: d.product_id, quantity: d.quantity_requested, price: d.offered_price_per_kg,
    msg: d.message, created: (d.created_at||'').slice(0,10) }; }

    function normFail(f)    { return { ...f, transporterId: f.transporter_id, transporterName: f.transporter_name,
    requestId: f.transport_request_id, product: f.produce_name,
    alternatives: typeof f.alternatives === 'string' ? JSON.parse(f.alternatives||'[]') : (f.alternatives||[]),
    reported: (f.reported_at||'').slice(0,10) }; }
    // ─── STATE ────────────────────────────────────────────────────────────────────
let state = { user:null, token:null, users:[], products:[], trans:[], deals:[], failures:[], activeNav:null };

async function loadAll() {
  
  try {
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
  } 
  
  catch(e) {
    console.error('loadAll error:', e);
  }
}


// ─── HELPERS ──────────────────────────────────────────────────────────────────

function showAlert(id, msg, type='info') {
  const el = document.getElementById(id);
  if(el) el.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
  setTimeout(()=>{ if(el) el.innerHTML=''; }, 4000);
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
}


function loadDemoData() {
  state.users    = SEED_USERS.map(normUser);
  state.products = SEED_PRODUCTS.map(normProduce);
  state.trans     = SEED_TRANS.map(normTrans);
  state.deals     = SEED_DEALS.map(normDeal);
  state.failures  = [];
}

function quickLogin(email, pass) {
  document.getElementById('login-email').value = email;
  document.getElementById('login-pass').value = pass;
  const demoUser = SEED_USERS.find(u => u.email === email && u.password === pass);
  
  if (demoUser) {
    state.user  = { ...demoUser, vehicle: demoUser.vehicle || '' };
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
  try {
    showAlert('auth-alert','Signing in...','info');
    
    const data = await apiFetch('/auth/login', { method:'POST', body: JSON.stringify({ email, password: pass }) });
    state.token = data.token;
    state.user  = { ...data.user, vehicle: data.user.vehicle||'' };
    
    try { localStorage.setItem('hl_token', state.token); localStorage.setItem('hl_user', JSON.stringify(state.user)); } catch(_){}
    await loadAll();
    initApp();
  } 
   
  catch(e) {
    if (e.message && e.message.toLowerCase().includes('failed to fetch')) {
      const user = SEED_USERS.find(u => u.email === email && u.password === pass);
      
      if (user) {
        state.user  = { ...user, vehicle: user.vehicle || '' };
        state.token = 'demo-token';
        
        try { localStorage.setItem('hl_token', state.token); localStorage.setItem('hl_user', JSON.stringify(state.user)); } catch(_){}
        loadDemoData();
        initApp();
        return;
      }
    }
    showAlert('auth-alert', e.message || 'Invalid email or password.', 'danger');
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
  
  try {
    
    showAlert('auth-alert','Registering...','info');
    
    const newUserData = await apiFetch('/auth/register', { method:'POST', body: JSON.stringify({ name, email, password: pass, role, location, vehicle }) });
    
    const newUser = normUser(newUserData);
    
    showAlert('auth-alert','Registration successful! You can now sign in.','success');

    switchAuthTab('login');

    document.getElementById('login-email').value = email;

    if (state.user && state.user.role === 'admin' && state.token && state.token !== 'demo-token') {
      state.users.push(newUser);

      try {
        const users = await apiFetch('/users');
        state.users = users.map(normUser);
      }
       catch(err) {
        console.warn('Could not refresh full admin users list:', err);
      }
      if (state.activeNav === 'users') renderAdminUsers();
    }
  } 
  catch(e) {
    showAlert('auth-alert', e.message || 'Registration failed.', 'danger');
  }
}


function doLogout() {
  state.user = null;
  state.token = null;
  state.users = []; state.products = []; state.trans = []; state.deals = []; state.failures = [];
  state.activeNav = null;
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
  document.getElementById('app').style.display='block';
  const u = state.user;
  const cfg = ROLE_CFG[u.role];app3
  
  onst avatar = u.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
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


/ ──────────────────────────────────────────────────────────────────────────────
//  FARMER PAGES
// ──────────────────────────────────────────────────────────────────────────────
 
function renderFarmerDashboard() {
  const u = state.user;
  const myP = state.products.filter(p=>p.farmerId===u.id);
  const myT = state.trans.filter(t=>t.farmerId===u.id);
  const myD = state.deals.filter(d=>d.farmerId===u.id);
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
      <button class="btn btn-primary btn-full" onclick="submitAddProduct()">Add to Listing</button>
    </div>
    up22up
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
