
function renderFarmerDeals() {
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
        <td>${d.expectedPrice ? 'Taka'+d.expectedPrice+'/kg' : '—'}</td>
        <td style="font-weight:600;color:${d.expectedPrice && d.price < d.expectedPrice ? 'var(--amber)' : 'var(--forest)'}">${d.price}/kg</td>
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
