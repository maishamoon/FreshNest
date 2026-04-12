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
    ${pending>0?`<div class="alert alert-warning">You have <strong>${pending} pending deal offer(s)</strong> from dealers waiting for your response.</div>`:''}
    <div class="info-grid">
      <div class="card">
        <div class="card-header"><div class="card-title">Recent Produce</div></div>
        <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr><th>Produce</th><th>Qty</th><th>Status</th><th>Fresh Days</th></tr></thead>
          <tbody>${myP.length?myP.slice(-4).reverse().map(p=>`<tr><td>${p.emoji||'🌿'} <strong>${p.name}</strong></td><td>${p.quantity} ${p.unit}</td><td>${badge(p.status)}</td><td>${p.freshDays} days</td></tr>`).join(''):'<tr><td colspan="4" style="text-align:center;color:#8FA8A0;padding:20px">No produce listed yet</td></tr>'}</tbody>
        </table></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Recent Transport</div></div>
        <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr><th>Product</th><th>Route</th><th>Status</th></tr></thead>
          <tbody>${myT.length?myT.slice(-4).reverse().map(t=>`<tr><td>${t.product}</td><td>${t.pickup}→${t.destination}</td><td>${badge(t.status)}</td></tr>`).join(''):'<tr><td colspan="3" style="text-align:center;color:#8FA8A0;padding:20px">No requests yet</td></tr>'}</tbody>
        </table></div>
      </div>
    </div>
  `;
}

function renderTransportDashboard() {
  const u = state.user;
  const myJobs = state.trans.filter(t=>t.assignedTo===u.id);
  const myFail = state.failures.filter(f=>f.transporterId===u.id);

  document.getElementById('page-body').innerHTML = `
    <div class="hero-banner" style="background:linear-gradient(135deg,#7E5109,#CA6F1E,#E67E22)">
      <div class="inner"><h2>Welcome, ${u.name}!</h2><p>Browse open transport requests, accept jobs, and manage your deliveries efficiently.</p></div>
    </div>
    <div class="stats-grid">
      <div class="stat-card green" data-icon="📋"><div class="stat-value">${state.trans.filter(t=>t.status==='Open').length}</div><div class="stat-label">Open Requests</div><div class="stat-sub">Available to accept</div></div>
      <div class="stat-card gold" data-icon="🗓️"><div class="stat-value">${myJobs.filter(j=>j.status==='Accepted').length}</div><div class="stat-label">Active Jobs</div><div class="stat-sub">In progress</div></div>
      <div class="stat-card forest" data-icon="✅"><div class="stat-value">${myJobs.filter(j=>j.status==='Completed').length}</div><div class="stat-label">Completed</div><div class="stat-sub">Delivered</div></div>
      <div class="stat-card sage" data-icon="⚠️"><div class="stat-value">${myFail.length}</div><div class="stat-label">Failures Reported</div><div class="stat-sub">Incidents</div></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Open Requests Nearby</div><button class="btn btn-sm btn-primary" onclick="navigate('offers')">View All</button></div>
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
