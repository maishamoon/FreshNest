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
