/**
 * Utility functions for safely resolving and formatting entities across BusMitra
 */

export function resolveCityName(val, fallback = '') {
  if (!val) return fallback;
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return val.city || val.name || fallback;
  }
  return String(val);
}

export function resolvePointName(point, fallback = '') {
  if (!point) return fallback;
  if (typeof point === 'string') return point;
  if (typeof point === 'object') {
    return point.name || point.city || fallback;
  }
  return String(point);
}

export function formatINR(val) {
  if (val === undefined || val === null) return '₹0';
  const num = Number(val);
  if (isNaN(num)) return `₹${val}`;
  return `₹${num.toLocaleString('en-IN')}`;
}

