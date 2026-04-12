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

  document.getElementById('sidebar-nav').innerHTML = cfg.navItems.map(item=>`
    <div class="nav-item" id="nav-${item.id}" onclick="navigate('${item.id}')">
      <span class="nav-icon">${item.icon}</span>${item.label}
    </div>
  `).join('');

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
    farmer: { dashboard:renderFarmerDashboard, products:renderMyProducts, transport:renderTransportReqs, deals:renderFarmerDeals, storage:renderStorageGuide },
    transport: { dashboard:renderTransportDashboard, offers:renderBrowseRequests, myjobs:renderMyJobs, failures:renderFailures },
    dealer: { dashboard:renderDealerDashboard, browse:renderBrowseProduce, mydeals:renderMyDeals },
    admin: { dashboard:renderAdminDashboard, users:renderAdminUsers, products:renderAdminProducts, transport:renderAdminTransport, deals:renderAdminDeals, failures:renderAdminFailures },
  };

  const fn = renders[state.user.role]?.[id];
  if(fn) fn();
}
