'use client';

import { useEffect } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  const handleGoHome = () => {
    window.location.href = '/feed';
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-red-900/20 rounded-full">
            <AlertTriangle className="text-red-400" size={48} />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-dark-100 mb-2">
            Something went wrong
          </h2>
          <p className="text-dark-400 text-sm">
            This might be caused by a browser extension (like translation).
            Try disabling browser translation for this site.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          <button
            onClick={handleGoHome}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Go to Feed
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left mt-4">
            <summary className="text-dark-500 text-sm cursor-pointer">
              Error Details
            </summary>
            <pre className="mt-2 p-3 bg-dark-800 rounded-lg text-xs text-red-400 overflow-auto">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
