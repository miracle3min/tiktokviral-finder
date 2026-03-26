'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="clay-section max-w-md mx-auto text-center space-y-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-red-50/80 shadow-clay-sm flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-700 mb-1">Oops, something went wrong</h3>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="clay-button inline-flex items-center gap-2 text-clay-500 hover:text-clay-600">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
