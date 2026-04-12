function renderTransportReqs() {
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
        <td>${t.pickup}</td><td>${t.destination}</td><td>${t.date}</td><td>${t.quantity}</td>
        <td>${t.transporterName||'<span style="color:#8FA8A0">Unassigned</span>'}</td>
        <td>${badge(t.status)}</td>
        <td>${t.status==='Open'?`<button class="btn btn-sm" style="background:#C0392B;color:white" onclick="cancelTransport('${t.id}')">Cancel</button>`:'—'}</td>
      </tr>`).join('')}</tbody>
    </table></div></div>`}
  `;
}  
