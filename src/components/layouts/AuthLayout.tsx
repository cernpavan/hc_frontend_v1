'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 border-b border-dark-800">
        <Link href="/" className="text-xl font-bold text-primary-400">
          Hindi Confession
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 text-center text-dark-500 text-sm">
        <p>18+ only. By using this platform, you agree to our Terms & Conditions.</p>
      </footer>
    </div>
  );
}
