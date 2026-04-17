export const today = () => new Date().toISOString().split('T')[0];

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const badgeColors = {
  available: 'bg-green-100 text-green-700',
  reserved: 'bg-amber-100 text-amber-800',
  sold: 'bg-gray-200 text-gray-600',
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  dealerAccepted: 'bg-emerald-100 text-emerald-700',
  dealeraccepted: 'bg-emerald-100 text-emerald-700',
  declined: 'bg-red-100 text-red-700',
  failed: 'bg-red-100 text-red-700',
  active: 'bg-green-100 text-green-800',
  pendingreview: 'bg-amber-100 text-amber-800',
  awaitingfarmerprice: 'bg-orange-100 text-orange-800',
  awaitingadminapproval: 'bg-sky-100 text-sky-800',
  published: 'bg-green-100 text-green-800',
  expiringsoon: 'bg-amber-100 text-amber-800',
  expired: 'bg-gray-200 text-gray-600',
  converted: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-200 text-gray-600',
};

export const getBadgeColor = (status) => badgeColors[status] || 'bg-gray-100 text-gray-800';

export const roleColors = {
  admin: 'bg-forest text-white',
  farmer: 'bg-green text-white',
  transport: 'bg-gold text-white',
  dealer: 'bg-slate text-white',
};

export const getRoleColor = (role) => roleColors[role] || 'bg-gray-100 text-gray-800';

export const roleLabels = {
  admin: 'Admin',
  farmer: 'Farmer',
  transport: 'Transport',
  dealer: 'Dealer',
};

export const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const parseQuantityValue = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? Math.max(value, 0) : 0;
  if (typeof value !== 'string') return 0;

  const cleaned = value.replace(/,/g, '').trim();
  if (!cleaned) return 0;

  const match = cleaned.match(/-?\d+(\.\d+)?/);
  if (!match) return 0;

  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
};