// src/utils/formatData.js

export function formatCurrency(val) {
  if (val === null || val === undefined) return '—';
  const n = Number(val);
  if (isNaN(n)) return val;
  return n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

export function formatNumber(val) {
  if (val === null || val === undefined) return '—';
  const n = Number(val);
  if (isNaN(n)) return val;
  return n.toLocaleString();
}

export function shortId(id = '') {
  if (!id) return '';
  return id.toString().slice(-6);
}
