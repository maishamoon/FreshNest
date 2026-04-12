function showAlert(id, msg, type='info') {
  const el = document.getElementById(id);
  if(el) el.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
  setTimeout(()=>{ if(el) el.innerHTML=''; }, 4000);
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

