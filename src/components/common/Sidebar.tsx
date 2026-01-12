'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Flame,
  Clock,
  Heart,
  MessageCircle,
  Moon,
  Tag,
  Users,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCommunitiesStore } from '@/store/communitiesStore';
import { useCurrentLanguage } from '@/hooks/useGuestLanguage';

const feedLinks = [
  { path: '/feed', icon: Clock, label: 'Latest', labelHi: 'नवीनतम', labelPa: 'ਨਵੀਨਤਮ' },
  { path: '/feed/trending', icon: Flame, label: 'Trending', labelHi: 'ट्रेंडिंग', labelPa: 'ਟ੍ਰੈਂਡਿੰਗ' },
  { path: '/feed/relatable', icon: Heart, label: 'Most Relatable', labelHi: 'सबसे रिलेटेबल', labelPa: 'ਸਭ ਤੋਂ ਸੰਬੰਧਤ' },
  { path: '/feed/commented', icon: MessageCircle, label: 'Most Discussed', labelHi: 'सबसे चर्चित', labelPa: 'ਸਭ ਤੋਂ ਚਰਚਿਤ' },
  { path: '/feed/night', icon: Moon, label: 'Night Mode', labelHi: 'रात्रि मोड', labelPa: 'ਰਾਤ ਮੋਡ' },
];

const tags = [
  { id: 'sexual-confession', label: 'Sexual Confession', labelHi: 'यौन कन्फेशन', labelPa: 'ਜਿਨਸੀ ਇਕਰਾਰ' },
  { id: 'fantasy-kinks', label: 'Fantasy / Kinks', labelHi: 'फैंटसी / किंक्स', labelPa: 'ਫੈਂਟਸੀ' },
  { id: 'relationship-affair', label: 'Relationship', labelHi: 'रिश्ता / अफेयर', labelPa: 'ਰਿਸ਼ਤਾ' },
  { id: 'guilt-regret', label: 'Guilt / Regret', labelHi: 'अपराध बोध / पछतावा', labelPa: 'ਦੋਸ਼ / ਪਛਤਾਵਾ' },
  { id: 'cheating', label: 'Cheating', labelHi: 'धोखा', labelPa: 'ਧੋਖਾ' },
  { id: 'one-night-story', label: 'One Night', labelHi: 'एक रात की कहानी', labelPa: 'ਇੱਕ ਰਾਤ' },
  { id: 'adult-advice', label: 'Adult Advice', labelHi: 'वयस्क सलाह', labelPa: 'ਬਾਲਗ ਸਲਾਹ' },
  { id: 'dark-thoughts', label: 'Dark Thoughts', labelHi: 'गहरे विचार', labelPa: 'ਹਨੇਰੇ ਵਿਚਾਰ' },
  { id: 'curiosity-question', label: 'Curiosity', labelHi: 'जिज्ञासा', labelPa: 'ਉਤਸੁਕਤਾ' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const currentLanguage = useCurrentLanguage();
  const isHindiLang = currentLanguage === 'hindi';
  const isPunjabiLang = currentLanguage === 'punjabi';

  // Use global communities store - fetches once, caches forever
  const { communities, fetchCommunities } = useCommunitiesStore();

  useEffect(() => {
    // This will only fetch if not already loaded
    fetchCommunities();
  }, [fetchCommunities]);

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    if (path === '/feed') {
      return pathname === '/feed';
    }
    return pathname === path;
  };

  // Helper function to check if a community is active
  const isCommunityActive = (slug: string) => {
    return pathname === `/community/${slug}`;
  };

  // Helper function to check if a tag is active
  const isTagActive = (tagId: string) => {
    return pathname === `/feed/tag/${tagId}`;
  };

  return (
    <div className="p-4 space-y-6">
      {/* Feed Filters */}
      <div>
        <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-3 px-3">
          {isHindiLang ? 'फीड' : isPunjabiLang ? 'ਫੀਡ' : 'Feed'}
        </h3>
        <nav className="space-y-1" role="navigation" aria-label="Feed filters">
          {feedLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all min-h-[44px] ${
                  active
                    ? 'bg-primary-600/20 text-primary-400 shadow-glow-primary/20'
                    : 'text-dark-300 hover:bg-dark-800 hover:text-dark-100'
                }`}
              >
                <link.icon size={18} />
                <span className={isHindiLang ? 'font-hindi' : isPunjabiLang ? 'font-punjabi' : ''}>
                  {isHindiLang ? link.labelHi : isPunjabiLang ? link.labelPa : link.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Communities */}
      {communities.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-3 px-3 flex items-center gap-2">
            <Users size={14} />
            {isHindiLang ? 'समुदाय' : isPunjabiLang ? 'ਭਾਈਚਾਰੇ' : 'Communities'}
          </h3>
          <nav className="space-y-1" role="navigation" aria-label="Communities">
            {communities.map((community) => {
              const active = isCommunityActive(community.slug);
              return (
                <Link
                  key={community.id}
                  href={`/community/${community.slug}`}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all min-h-[44px] ${
                    active
                      ? 'bg-primary-600/20 text-primary-400'
                      : 'text-dark-300 hover:bg-dark-800 hover:text-dark-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{community.icon || '💬'}</span>
                    <span className="text-sm truncate">{community.name}</span>
                  </div>
                  <span className="text-xs text-dark-500 bg-dark-800 px-2 py-0.5 rounded-full">
                    {community.postCount}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Tags - Improved Mobile Responsive */}
      <div>
        <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-3 px-3 flex items-center gap-2">
          <Tag size={14} />
          {isHindiLang ? 'टैग' : isPunjabiLang ? 'ਟੈਗ' : 'Tags'}
        </h3>
        <div
          className="flex flex-wrap gap-1.5 sm:gap-2 px-1 max-w-full overflow-hidden"
          role="navigation"
          aria-label="Tags"
        >
          {tags.map((tag) => {
            const active = isTagActive(tag.id);
            return (
              <Link
                key={tag.id}
                href={`/feed/tag/${tag.id}`}
                className={`inline-flex items-center px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs rounded-full transition-all duration-200 cursor-pointer min-h-[32px] sm:min-h-[36px] max-w-full truncate ${
                  active
                    ? 'bg-primary-600 text-white border-primary-500 hover:bg-primary-500'
                    : 'bg-dark-800 text-dark-300 border border-dark-700 hover:bg-dark-750 hover:text-dark-200 hover:border-dark-600'
                } ${isHindiLang ? 'font-hindi' : isPunjabiLang ? 'font-punjabi' : ''}`}
              >
                <span className="truncate">{isHindiLang ? tag.labelHi : isPunjabiLang ? tag.labelPa : tag.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* NSFW Notice */}
      <div className="p-3 bg-accent-900/20 border border-accent-700/30 rounded-xl mx-1">
        <p className={`text-xs text-accent-300 ${isHindiLang ? 'font-hindi' : isPunjabiLang ? 'font-punjabi' : ''}`}>
          {isHindiLang
            ? 'इस प्लेटफॉर्म पर 18+ वयस्क सामग्री है।'
            : isPunjabiLang
            ? 'ਇਸ ਪਲੇਟਫਾਰਮ ਵਿੱਚ 18+ ਬਾਲਗ ਸਮੱਗਰੀ ਹੈ।'
            : 'This platform contains 18+ adult content.'}
        </p>
      </div>
    </div>
  );
}
