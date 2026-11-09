import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function SuccessMessage({ message, onClose, className = '' }) {
  if (!message) return null;

  return (
    <div className={`p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg flex items-start justify-between text-emerald-800 shadow-sm ${className}`}>
      <div className="flex items-start">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 mr-3 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-emerald-400 hover:text-emerald-700 ml-3 transition-colors"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
