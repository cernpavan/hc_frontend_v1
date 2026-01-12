'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, MessageSquare, Users, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Landing() {
  const router = useRouter();
  const { ageVerified, verifyAge } = useAuthStore();
  const [showAgeModal, setShowAgeModal] = useState(false);

  const handleEnter = () => {
    if (ageVerified) {
      router.push('/feed');
    } else {
      setShowAgeModal(true);
    }
  };

  const confirmAge = () => {
    verifyAge();
    router.push('/feed');
  };

  const features = [
    {
      icon: Lock,
      title: 'Completely Anonymous',
      titleHi: 'पूरी तरह गुमनाम',
      desc: 'No real identity, no DMs, no followers. Your secrets are safe.',
      descHi: 'कोई असली पहचान नहीं, कोई DM नहीं, कोई फॉलोअर्स नहीं। आपके राज़ सुरक्षित हैं।',
    },
    {
      icon: Shield,
      title: 'Safe Space',
      titleHi: 'सुरक्षित जगह',
      desc: 'Strict moderation to keep the platform safe for everyone.',
      descHi: 'सभी के लिए प्लेटफॉर्म को सुरक्षित रखने के लिए सख्त मॉडरेशन।',
    },
    {
      icon: MessageSquare,
      title: 'Share Freely',
      titleHi: 'खुलकर शेयर करें',
      desc: 'Confess your deepest secrets, fantasies, and stories.',
      descHi: 'अपने गहरे राज़, फैंटसी और कहानियाँ शेयर करें।',
    },
    {
      icon: Users,
      title: 'Hindi Community',
      titleHi: 'हिंदी समुदाय',
      desc: 'Made for Hindi speakers. Read and write in your language.',
      descHi: 'हिंदी बोलने वालों के लिए बनाया गया। अपनी भाषा में पढ़ें और लिखें।',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-accent-600/10" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center space-y-8">
            {/* Logo */}
            <h1 className="text-4xl sm:text-6xl font-bold">
              <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent">
                Hindi Confession
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-xl sm:text-2xl text-dark-300 max-w-2xl mx-auto">
              Share your deepest confessions anonymously.
              <br />
              <span className="font-hindi">अपने राज़ गुमनाम रूप से साझा करें।</span>
            </p>

            {/* 18+ Warning */}
            <div className="inline-block bg-accent-900/30 border border-accent-700/50 rounded-lg px-4 py-2">
              <p className="text-accent-300 text-sm">
                This platform is for adults (18+) only
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button
                onClick={handleEnter}
                className="btn-primary text-lg px-8 py-3 flex items-center gap-2 group"
              >
                Browse Confessions
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="card hover:border-primary-700/50 transition-colors group"
            >
              <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600/30 transition-colors">
                <feature.icon size={24} className="text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-dark-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm font-hindi text-dark-400 mb-2">
                {feature.titleHi}
              </p>
              <p className="text-dark-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-dark-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-dark-500 text-sm">
          <p>&copy; 2024 Hindi Confession. All rights reserved.</p>
          <p className="mt-2">
            By using this platform, you confirm you are 18+ and agree to our
            <Link href="/terms" className="text-primary-400 hover:underline ml-1">
              Terms & Conditions
            </Link>
          </p>
        </div>
      </footer>

      {/* Age Verification Modal */}
      {showAgeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 bg-accent-600/20 rounded-full flex items-center justify-center mx-auto">
              <Shield size={32} className="text-accent-400" />
            </div>

            <h2 className="text-2xl font-bold">Age Verification</h2>

            <p className="text-dark-300">
              This platform contains adult content (18+) including NSFW material.
              By entering, you confirm that you are at least 18 years old.
            </p>

            <p className="text-dark-400 text-sm font-hindi">
              इस प्लेटफॉर्म पर वयस्क सामग्री (18+) है। प्रवेश करके,
              आप पुष्टि करते हैं कि आपकी उम्र कम से कम 18 वर्ष है।
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowAgeModal(false)}
                className="btn-secondary flex-1"
              >
                I am under 18
              </button>
              <button onClick={confirmAge} className="btn-primary flex-1">
                I am 18 or older
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
