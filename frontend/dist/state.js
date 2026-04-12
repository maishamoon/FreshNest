let state = { user:null, token:null, users:[], products:[], trans:[], deals:[], failures:[], activeNav:null, retryAction:null };

function setPageLoading(message = 'Loading data...') {
  const body = document.getElementById('page-body');
  if (!body) return;
  body.innerHTML = `
    <div class="card">
      <div class="empty-state">
        <div class="empty-icon">loading</div>
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
        <div class="empty-icon">error</div>
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

