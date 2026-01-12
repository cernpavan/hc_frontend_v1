'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, UserCircle, Languages, Plus, LogOut, LogIn, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useCurrentLanguage, setGuestLanguage } from '@/hooks/useGuestLanguage';
import SearchBar from './SearchBar';
import { useLiveUsers } from '@/hooks/useLiveUsers';

type Language = 'hindi' | 'english' | 'punjabi';

const languages: { code: Language; name: string; nativeName: string; short: string }[] = [
  { code: 'hindi', name: 'Hindi', nativeName: 'हिंदी', short: 'HI' },
  { code: 'english', name: 'English', nativeName: 'English', short: 'EN' },
  { code: 'punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', short: 'PA' },
];

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, setLanguage, openAuthModal, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileAvatarMenu, setShowMobileAvatarMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showMobileLanguageMenu, setShowMobileLanguageMenu] = useState(false);
  const { userCount } = useLiveUsers();

  const handleCreatePost = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openAuthModal(() => router.push('/create'));
    }
  };

  const handleSignOut = () => {
    setShowMenu(false);
    logout();
    toast.success('Signed out successfully');
    router.push('/feed');
  };

  const handleLanguageChange = (langCode: Language) => {
    if (!isAuthenticated) {
      setGuestLanguage(langCode);
    } else {
      setLanguage(langCode);
    }
    setShowLanguageMenu(false);
    setShowMobileLanguageMenu(false);
    toast.success(`Language changed to ${languages.find(l => l.code === langCode)?.nativeName}`);
  };

  const currentLanguage = useCurrentLanguage();
  const currentLangData = languages.find(l => l.code === currentLanguage) || languages[0];

  const handleMobileAvatarClick = () => {
    setShowMobileAvatarMenu(!showMobileAvatarMenu);
  };

  return (
    <header className="sticky top-0 z-50 bg-dark-900/98 backdrop-blur-md border-b border-dark-750 shadow-lg">
      {/* Mobile Header - Only visible on mobile (< md breakpoint) */}
      <div className="md:hidden">
        <div className="px-3 h-14 flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/feed" className="flex items-center flex-shrink-0">
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              HC
            </span>
          </Link>

          {/* Mobile Search Bar - Compact */}
          <div className="flex-1 mx-2 max-w-[200px]">
            <SearchBar compact />
          </div>

          {/* Language Selector - Mobile */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowMobileLanguageMenu(!showMobileLanguageMenu)}
              className="btn-icon-sm bg-transparent text-dark-300 hover:bg-dark-800 hover:text-dark-100 flex items-center gap-0.5"
              title="Change Language"
              aria-label="Change Language"
            >
              <Languages size={16} />
              <span className="text-[10px] font-medium">{currentLangData.short}</span>
              <ChevronDown size={12} />
            </button>

            {/* Mobile Language Dropdown */}
            {showMobileLanguageMenu && (
              <>
                <div
                  className="fixed inset-0 z-[100]"
                  onClick={() => setShowMobileLanguageMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-40 bg-dark-800 border border-dark-700 rounded-lg shadow-xl py-1 z-[101]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-dark-700 transition-colors ${
                        currentLanguage === lang.code ? 'text-primary-400 bg-dark-750' : 'text-dark-200'
                      }`}
                    >
                      <span className={lang.code === 'hindi' ? 'font-hindi' : lang.code === 'punjabi' ? 'font-punjabi' : ''}>
                        {lang.nativeName}
                      </span>
                      <span className="text-[10px] text-dark-500">{lang.short}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Profile Icon - Mobile */}
          <div className="flex-shrink-0">
            <button
              onClick={handleMobileAvatarClick}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-dark-800 border border-dark-700 hover:border-primary-500 hover:bg-dark-700 transition-colors"
              aria-label={isAuthenticated ? 'Profile menu' : 'Sign in'}
            >
              <UserCircle size={20} className="text-dark-300" />
            </button>
          </div>
        </div>

        {/* Mobile Profile Menu Dropdown - Fixed positioned outside header */}
        {showMobileAvatarMenu && (
          <>
            <div
              className="fixed inset-0 z-[100] bg-black/20"
              onClick={() => setShowMobileAvatarMenu(false)}
            />
            <div className="fixed right-3 top-16 w-48 bg-dark-800 border border-dark-700 rounded-lg shadow-xl py-1 z-[101]">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/my-posts"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-dark-700 transition-colors"
                    onClick={() => setShowMobileAvatarMenu(false)}
                  >
                    <User size={18} />
                    <span>Go to Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setShowMobileAvatarMenu(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowMobileAvatarMenu(false);
                    openAuthModal();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-primary-400 hover:bg-dark-700 transition-colors"
                >
                  <LogIn size={18} />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Desktop Header - Only visible on desktop (>= md breakpoint) */}
      <div className="hidden md:block">
        <div className="w-full h-[58px] flex items-center">
          {/* Left Section - Logo at extreme left (above sidebar, w-64 matches sidebar width) */}
          <div className="flex items-center flex-shrink-0 w-64 pl-5">
            <Link href="/feed" className="flex items-center">
              <span className="text-[21px] font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent tracking-tight">
                Hindi Confession
              </span>
            </Link>
          </div>

          {/* Rest of header - fills remaining space with balanced layout */}
          <div className="flex-1 flex items-center justify-between pr-5">
            {/* Left group: Live Users */}
            <div className="flex items-center">
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-dark-800/50 rounded-full border border-dark-700/70">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[13px] font-medium text-dark-300">
                  {userCount.toLocaleString()} online
                </span>
              </div>
            </div>

            {/* Center: Search Bar - properly centered */}
            <div className="flex-1 flex justify-center px-6">
              <div className="w-full max-w-md">
                <SearchBar />
              </div>
            </div>

            {/* Right group: Actions aligned together */}
            <div className="flex items-center gap-2">
              {/* Create Post Button */}
              {isAuthenticated ? (
                <Link
                  href="/create"
                  className="btn-primary flex items-center gap-1.5 px-4 py-2 text-[13px]"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span className="font-semibold">Confess</span>
                </Link>
              ) : (
                <button
                  onClick={handleCreatePost}
                  className="btn-primary flex items-center gap-1.5 px-4 py-2 text-[13px]"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span className="font-semibold">Confess</span>
                </button>
              )}

              {/* Subtle vertical divider */}
              <div className="w-px h-6 bg-dark-700/50 mx-1"></div>

              {/* Language Selector - Desktop */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-dark-300 hover:bg-dark-800 hover:text-dark-100 transition-colors border border-dark-700/50"
                  title="Change Language"
                  aria-label="Change Language"
                >
                  <Languages size={16} />
                  <span className={`text-[12px] font-medium ${currentLanguage === 'hindi' ? 'font-hindi' : currentLanguage === 'punjabi' ? 'font-punjabi' : ''}`}>
                    {currentLangData.nativeName}
                  </span>
                  <ChevronDown size={14} className={`transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Language Dropdown */}
                {showLanguageMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowLanguageMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-1.5 w-44 bg-dark-800 border border-dark-700 rounded-xl shadow-xl py-1 animate-in z-50">
                      <div className="px-3 py-2 border-b border-dark-700">
                        <span className="text-[11px] font-medium text-dark-500 uppercase tracking-wider">Select Language</span>
                      </div>
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 text-[13px] hover:bg-dark-700 transition-colors ${
                            currentLanguage === lang.code ? 'text-primary-400 bg-dark-750' : 'text-dark-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={lang.code === 'hindi' ? 'font-hindi' : lang.code === 'punjabi' ? 'font-punjabi' : ''}>
                              {lang.nativeName}
                            </span>
                            {currentLanguage === lang.code && (
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span>
                            )}
                          </div>
                          <span className="text-[10px] text-dark-500 font-medium">{lang.short}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* User Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-dark-800 transition-colors"
                  aria-label={isAuthenticated ? 'Profile menu' : 'Sign in'}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-dark-800 border border-dark-700 hover:border-dark-600 transition-colors">
                    <UserCircle size={18} className="text-dark-300" />
                  </div>
                  {isAuthenticated && (
                    <span className="text-[13px] font-medium hidden lg:inline text-dark-200">{user?.username}</span>
                  )}
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-1.5 w-48 bg-dark-800 border border-dark-700 rounded-xl shadow-xl py-1 animate-in z-50">
                      {isAuthenticated ? (
                        <>
                          <Link
                            href="/my-posts"
                            className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-dark-700 transition-colors text-[13px]"
                            onClick={() => setShowMenu(false)}
                          >
                            <User size={16} />
                            <span className="font-medium">Go to Profile</span>
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors text-[13px]"
                          >
                            <LogOut size={16} />
                            <span className="font-medium">Sign Out</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            openAuthModal();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-primary-400 hover:bg-dark-700 transition-colors text-[13px]"
                        >
                          <LogIn size={16} />
                          <span className="font-medium">Sign In</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
