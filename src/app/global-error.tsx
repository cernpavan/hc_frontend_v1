'use client';

import { useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-dark-950">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-dark-700 rounded-xl p-6 max-w-md w-full text-center space-y-6">
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
                An unexpected error occurred. Please try again.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={reset}
                className="bg-primary-600 hover:bg-primary-500 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw size={18} />
                Try Again
              </button>
              <a
                href="/feed"
                className="bg-dark-700 hover:bg-dark-600 text-dark-200 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Go to Feed
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
