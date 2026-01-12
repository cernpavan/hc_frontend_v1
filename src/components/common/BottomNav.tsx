'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, Plus, Flame, Menu, LucideIcon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCurrentLanguage } from '@/hooks/useGuestLanguage';
import clsx from 'clsx';
import CommunityModal from './CommunityModal';

interface NavItem {
  path: string;
  icon: LucideIcon;
  label: string;
  labelHi: string;
  labelPa: string;
  requiresAuth?: boolean;
  isButton?: boolean;
  isCenter?: boolean;
  isKahaniya?: boolean;
  onClick?: () => void;
}

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const currentLanguage = useCurrentLanguage();
  const isHindiLang = currentLanguage === 'hindi';
  const isPunjabiLang = currentLanguage === 'punjabi';
  const [showCommunityModal, setShowCommunityModal] = useState(false);

  const handleMenuClick = () => {
    window.dispatchEvent(new CustomEvent('toggleMobileSidebar'));
  };

  const handleCommunityClick = () => {
    setShowCommunityModal(true);
  };

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      openAuthModal(() => router.push('/create'));
    } else {
      router.push('/create');
    }
  };

  const handleKahaniyaClick = () => {
    router.push('/kahaniya');
  };

  const navItems: NavItem[] = [
    {
      path: '/feed',
      icon: Home,
      label: 'Home',
      labelHi: 'होम',
      labelPa: 'ਹੋਮ',
    },
    {
      path: '#community',
      icon: Users,
      label: 'Community',
      labelHi: 'समुदाय',
      labelPa: 'ਭਾਈਚਾਰਾ',
      isButton: true,
      onClick: handleCommunityClick,
    },
    {
      path: '/create',
      icon: Plus,
      label: 'Add',
      labelHi: 'जोड़ें',
      labelPa: 'ਜੋੜੋ',
      isCenter: true,
      requiresAuth: true,
      onClick: handleCreateClick,
    },
    {
      path: '/kahaniya',
      icon: Flame,
      label: 'Stories',
      labelHi: 'कहानियाँ',
      labelPa: 'ਕਹਾਣੀਆਂ',
      isKahaniya: true,
      onClick: handleKahaniyaClick,
    },
  ];

  // Don't show on auth pages or landing
  if (pathname === '/' ||
      pathname.startsWith('/auth') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <nav
        className="bottom-nav overflow-x-hidden md:hidden"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto overflow-x-hidden relative">
          {navItems.map((item) => {
            const isActive = !item.isButton && !item.isCenter && (
              pathname === item.path ||
              (item.path === '/feed' && pathname.startsWith('/feed') && !pathname.includes('/search')) ||
              (item.path === '#community' && pathname.startsWith('/community')) ||
              (item.path === '/kahaniya' && pathname.startsWith('/kahaniya'))
            );

            const handleClick = (e: React.MouseEvent) => {
              if (item.onClick) {
                e.preventDefault();
                item.onClick();
                return;
              }
              if (item.requiresAuth && !isAuthenticated) {
                e.preventDefault();
                openAuthModal(() => router.push(item.path));
              }
            };

            // Render center button (Add Confession) with special styling
            if (item.isCenter) {
              return (
                <button
                  key={item.path}
                  onClick={handleClick}
                  className={clsx(
                    'flex flex-col items-center justify-center w-16 h-full',
                    'transition-all duration-200',
                    'touch-target'
                  )}
                  aria-label={isHindiLang ? item.labelHi : isPunjabiLang ? item.labelPa : item.label}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md shadow-primary-500/25">
                    <item.icon size={20} strokeWidth={2.5} />
                  </div>
                  <span className={clsx(
                    'text-[10px] mt-1 font-medium text-primary-400',
                    isHindiLang && 'font-hindi',
                    isPunjabiLang && 'font-punjabi'
                  )}>
                    {isHindiLang ? item.labelHi : isPunjabiLang ? item.labelPa : item.label}
                  </span>
                </button>
              );
            }

            // Render Kahaniya (Stories) with special accent styling
            if (item.isKahaniya) {
              const isKahaniyaActive = pathname.startsWith('/kahaniya');
              return (
                <button
                  key={item.path}
                  onClick={handleClick}
                  className={clsx(
                    'flex flex-col items-center justify-center w-16 h-full',
                    'transition-colors duration-200 touch-target',
                    isKahaniyaActive
                      ? 'text-orange-400'
                      : 'text-dark-400 hover:text-orange-400'
                  )}
                  aria-label={isHindiLang ? item.labelHi : isPunjabiLang ? item.labelPa : item.label}
                >
                  <item.icon
                    size={24}
                    className={clsx(
                      'transition-transform duration-200',
                      isKahaniyaActive && 'scale-110'
                    )}
                  />
                  <span className={clsx(
                    'text-[10px] mt-1 font-medium',
                    isHindiLang && 'font-hindi',
                    isPunjabiLang && 'font-punjabi'
                  )}>
                    {isHindiLang ? item.labelHi : isPunjabiLang ? item.labelPa : item.label}
                  </span>
                </button>
              );
            }

            // Render as button for Community
            if (item.isButton) {
              const isCommunityActive = pathname.startsWith('/community');
              return (
                <button
                  key={item.path}
                  onClick={handleClick}
                  className={clsx(
                    'flex flex-col items-center justify-center w-16 h-full',
                    'transition-colors duration-200 touch-target',
                    isCommunityActive ? 'text-primary-400' : 'text-dark-400 hover:text-dark-300'
                  )}
                  aria-label={isHindiLang ? item.labelHi : isPunjabiLang ? item.labelPa : item.label}
                >
                  <item.icon
                    size={24}
                    className={clsx(
                      'transition-transform duration-200',
                      isCommunityActive && 'scale-110'
                    )}
                  />
                  <span className={clsx(
                    'text-[10px] mt-1 font-medium',
                    isHindiLang && 'font-hindi',
                    isPunjabiLang && 'font-punjabi'
                  )}>
                    {isHindiLang ? item.labelHi : isPunjabiLang ? item.labelPa : item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={handleClick}
                className={clsx(
                  'flex flex-col items-center justify-center w-16 h-full',
                  'transition-colors duration-200 touch-target',
                  isActive ? 'text-primary-400' : 'text-dark-400 hover:text-dark-300'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon
                  size={24}
                  className={clsx(
                    'transition-transform duration-200',
                    isActive && 'scale-110'
                  )}
                />
                <span className={clsx(
                  'text-[10px] mt-1 font-medium',
                  isHindiLang && 'font-hindi',
                  isPunjabiLang && 'font-punjabi'
                )}>
                  {isHindiLang ? item.labelHi : isPunjabiLang ? item.labelPa : item.label}
                </span>
              </Link>
            );
          })}

          {/* Menu button for sidebar access */}
          <button
            onClick={handleMenuClick}
            className="flex flex-col items-center justify-center w-16 h-full text-dark-400 hover:text-dark-300 transition-colors duration-200 touch-target"
            aria-label={isHindiLang ? 'मेन्यू खोलें' : isPunjabiLang ? 'ਮੀਨੂ ਖੋਲ੍ਹੋ' : 'Open menu'}
          >
            <Menu size={24} />
            <span className={clsx(
              'text-[10px] mt-1 font-medium',
              isHindiLang && 'font-hindi',
              isPunjabiLang && 'font-punjabi'
            )}>
              {isHindiLang ? 'और' : isPunjabiLang ? 'ਹੋਰ' : 'More'}
            </span>
          </button>
        </div>
      </nav>

      {/* Community Selection Modal */}
      <CommunityModal
        isOpen={showCommunityModal}
        onClose={() => setShowCommunityModal(false)}
      />
    </>
  );
}
