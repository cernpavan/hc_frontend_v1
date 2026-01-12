'use client';

import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function AgeVerifyPage() {
  const router = useRouter();
  const { verifyAge } = useAuthStore();

  const handleConfirm = () => {
    verifyAge();
    router.push('/register');
  };

  const handleDeny = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-accent-600/20 rounded-full flex items-center justify-center mx-auto">
          <Shield size={40} className="text-accent-400" />
        </div>

        <h1 className="text-3xl font-bold">Age Verification Required</h1>

        <div className="space-y-4 text-dark-300">
          <p>
            Hindi Confession contains adult content including NSFW material.
            This platform is intended for adults only (18+).
          </p>

          <p className="font-hindi text-dark-400">
            हिंदी कन्फेशन में NSFW सामग्री सहित वयस्क सामग्री है।
            यह प्लेटफॉर्म केवल वयस्कों के लिए है (18+)।
          </p>
        </div>

        <div className="bg-accent-900/20 border border-accent-700/50 rounded-lg p-4 text-sm text-accent-300">
          By clicking "I am 18+", you confirm that:
          <ul className="mt-2 space-y-1 text-left list-disc list-inside">
            <li>You are at least 18 years of age</li>
            <li>It is legal to view adult content in your jurisdiction</li>
            <li>You wish to view such content</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <button onClick={handleDeny} className="btn-secondary flex-1">
            Exit
          </button>
          <button onClick={handleConfirm} className="btn-primary flex-1">
            I am 18 or older
          </button>
        </div>
      </div>
    </div>
  );
}
