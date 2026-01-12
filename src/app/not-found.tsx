'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="text-center">
        {/* 404 */}
        <h1 className="text-8xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-4">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-dark-200 mb-4">
          Page Not Found
        </h2>

        <p className="text-dark-400 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
          Maybe it was just a confession that expired.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleGoBack}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <Link href="/feed" className="btn-primary flex items-center gap-2">
            <Home size={18} />
            Go to Feed
          </Link>
        </div>
      </div>
    </div>
  );
}
