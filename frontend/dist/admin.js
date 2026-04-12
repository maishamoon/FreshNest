function renderAdminPanel() {
  renderAdminDashboard();
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
        <td><span class="badge ${{admin:'badge-gray',farmer:'badge-green',transport:'badge-gold',dealer:'badge-blue'}[u.role]||'badge-gray'}">${{admin:'',farmer:'',transport:'',dealer:''}[u.role]||''} ${u.role}</span></td>
        <td>${u.location||u.vehicle||'—'}</td><td>${u.joined}</td>
      </tr>`).join('')}</tbody>
    </table></div></div>
  `;
}
