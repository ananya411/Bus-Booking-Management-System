import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ErrorMessage({ message, onClose, className = '' }) {
  if (!message) return null;

  return (
    <div className={`p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start justify-between text-red-800 shadow-sm ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-red-400 hover:text-red-700 ml-3 transition-colors"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
