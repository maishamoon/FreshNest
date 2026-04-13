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
            <td><button class="btn btn-sm" style="background:#C0392B;color:white" onclick="removeProduct('${p.id}')">Remove</button></td>
          </tr>`).join('')}
          </tbody>
        </table>
      </div></div>`}
  `;
}

function openAddProduct() {
  const myP = state.products.filter(p=>p.farmerId===state.user.id);
  
  openModal(`<div class="modal">
    <div class="modal-header"><span class="modal-title">Add New Produce</span><button class="modal-close" onclick="closeModal()">X</button></div>
    <div class="modal-body">
      <div id="add-prod-alert"></div>
      <div class="form-group">
        <label class="form-label">Produce Type</label>
        <select class="form-control" id="ap-name" onchange="updateStorageTip()">
          <optgroup label="Fruits">${Object.entries(PRODUCE_DB).filter(([,v])=>v.cat==='Fruit').map(([k,v])=>`<option>${k}</option>`).join('')}</optgroup>
          <optgroup label="Vegetables">${Object.entries(PRODUCE_DB).filter(([,v])=>v.cat==='Vegetable').map(([k,v])=>`<option>${k}</option>`).join('')}</optgroup>
        </select>
      </div>
      <div id="storage-tip-box" class="storage-tip">Recommended: 13-15C - 85-90% humidity - Fresh for 14 days.</div>
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
        <label class="form-label">Asking Price (Taka/kg) <span style="color:var(--slate);font-weight:400">(Optional - visible to dealers)</span></label>
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
    document.getElementById('storage-tip-box').innerHTML = `<strong>${name}:</strong> Store at ${info.temp} - ${info.humidity} humidity - Fresh for <strong>${info.freshDays} days</strong>.<br><em>${info.tips}</em>`;
  }
}
