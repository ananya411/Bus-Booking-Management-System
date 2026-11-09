import React from 'react';

export default function StatusBadge({ status, className = '' }) {
  if (!status) return null;

  const normalized = String(status).toLowerCase();

  let styles = 'bg-gray-100 text-gray-800 border-gray-200';

  if (['confirmed', 'active', 'completed', 'success', 'paid'].includes(normalized)) {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (['cancelled', 'canceled', 'failed', 'inactive'].includes(normalized)) {
    styles = 'bg-red-50 text-red-700 border-red-200';
  } else if (['pending', 'processing', 'scheduled'].includes(normalized)) {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (['delayed', 'running', 'in_transit'].includes(normalized)) {
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${styles} ${className}`}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-75"></span>
      {status}
    </span>
  );
}
