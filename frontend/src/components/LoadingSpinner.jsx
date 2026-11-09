import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading...', size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center py-8 text-indigo-600 ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size] || sizeClasses.md}`} />
      {text && <p className="mt-2 text-sm font-medium text-gray-600">{text}</p>}
    </div>
  );
}
