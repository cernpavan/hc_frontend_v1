'use client';

import Footer from '@/components/common/Footer';
import Pagination from '@/components/common/Pagination';
import PostCard from '@/components/post/PostCard';
import { usePagination } from '@/hooks/usePagination';
import { useAuthStore } from '@/store/authStore';
import { Post } from '@/types';
import { transformPosts } from '@/utils/postTransform';
import clsx from 'clsx';
import { ArrowLeft, Clock, Flame, Hash, Heart, MessageCircle, MessageSquare, Plus, PlusCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { memo, useMemo, useState } from 'react';

// Content type for web - Confessions or Kahaniya (Stories)
type ContentType = 'confessions' | 'kahaniya';

// Kahaniya filter options
type KahaniyaFilter = 'trending' | 'latest' | 'relatable' | 'hot';

// Skeleton loading component with shimmer effect for better perceived performance
const PostSkeleton = memo(() => (
  <div className="card animate-fade-in">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-24 h-4 skeleton-shimmer rounded" />
      <div className="w-16 h-4 skeleton-shimmer rounded" />
    </div>
    <div className="w-3/4 h-5 skeleton-shimmer rounded mb-3" />
    <div className="flex gap-2 mb-3">
      <div className="w-20 h-6 skeleton-shimmer rounded-full" />
      <div className="w-16 h-6 skeleton-shimmer rounded-full" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="w-full h-4 skeleton-shimmer rounded" />
      <div className="w-full h-4 skeleton-shimmer rounded" />
      <div className="w-2/3 h-4 skeleton-shimmer rounded" />
    </div>
    <div className="pt-3 border-t border-dark-750 flex items-center gap-4">
      <div className="w-20 h-8 skeleton-shimmer rounded-full" />
      <div className="w-16 h-8 skeleton-shimmer rounded-full" />
      <div className="w-12 h-8 skeleton-shimmer rounded-full" />
    </div>
  </div>
));
PostSkeleton.displayName = 'PostSkeleton';

// Tag display information
const tagInfo: Record<string, { label: string; labelHi: string; labelPa: string; description: string }> = {
  'sexual-confession': {
    label: 'Sexual Confession',
    labelHi: 'यौन कन्फेशन',
    labelPa: 'ਜਿਨਸੀ ਇਕਰਾਰ',
    description: 'Intimate confessions and experiences',
  },
  'fantasy-kinks': {
    label: 'Fantasy / Kinks',
    labelHi: 'फैंटसी / किंक्स',
    labelPa: 'ਫੈਂਟਸੀ',
    description: 'Fantasies and desires',
  },
  'relationship-affair': {
    label: 'Relationship',
    labelHi: 'रिश्ता / अफेयर',
    labelPa: 'ਰਿਸ਼ਤਾ',
    description: 'Relationship stories and experiences',
  },
  'guilt-regret': {
    label: 'Guilt / Regret',
    labelHi: 'अपराध बोध / पछतावा',
    labelPa: 'ਦੋਸ਼ / ਪਛਤਾਵਾ',
    description: 'Things you feel guilty about',
  },
  'cheating': {
    label: 'Cheating',
    labelHi: 'धोखा',
    labelPa: 'ਧੋਖਾ',
    description: 'Stories about infidelity',
  },
  'one-night-story': {
    label: 'One Night Story',
    labelHi: 'एक रात की कहानी',
    labelPa: 'ਇੱਕ ਰਾਤ ਦੀ ਕਹਾਣੀ',
    description: 'One-time encounters',
  },
  'adult-advice': {
    label: 'Adult Advice',
    labelHi: 'वयस्क सलाह',
    labelPa: 'ਬਾਲਗ ਸਲਾਹ',
    description: 'Seeking or sharing advice',
  },
  'dark-thoughts': {
    label: 'Dark Thoughts',
    labelHi: 'गहरे विचार',
    labelPa: 'ਹਨੇਰੇ ਵਿਚਾਰ',
    description: 'Deep and dark thoughts',
  },
  'curiosity-question': {
    label: 'Curiosity / Question',
    labelHi: 'जिज्ञासा / सवाल',
    labelPa: 'ਉਤਸੁਕਤਾ / ਸਵਾਲ',
    description: 'Questions and curiosities',
  },
};

// Kahaniya filter definitions (Hindi stories community)
const kahaniFilters = [
  { id: 'trending', icon: TrendingUp, label: 'Trending', labelHi: 'ट्रेंडिंग', labelPa: 'ਟ੍ਰੈਂਡਿੰਗ' },
  { id: 'latest', icon: Clock, label: 'Latest', labelHi: 'नवीनतम', labelPa: 'ਨਵੀਨਤਮ' },
  { id: 'relatable', icon: Heart, label: 'Relatable', labelHi: 'रिलेटेबल', labelPa: 'ਸੰਬੰਧਤ' },
  { id: 'hot', icon: Flame, label: 'Hottest', labelHi: 'सबसे हॉट', labelPa: 'ਸਭ ਤੋਂ ਹੌਟ' },
];

interface FeedPageProps {
  params?: { filter?: string; tagSlug?: string };
}

export default function Feed({ params }: FeedPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filter = params?.filter;
  const tagSlug = params?.tagSlug;
  const tag = tagSlug || searchParams.get('tag');
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const currentLanguage = isAuthenticated ? user?.language : (typeof window !== 'undefined' ? localStorage.getItem('guest-language') : null) || 'hindi';
  const isHindiLang = currentLanguage === 'hindi';
  const isPunjabiLang = currentLanguage === 'punjabi';

  // Determine if we're on a tag page
  const isTagPage = Boolean(tag);
  const [tagSort, setTagSort] = useState<'latest' | 'trending' | 'top'>('latest');

  // Web-only: Content type toggle (Confessions vs Kahaniya/Stories)
  // This state is only used on desktop (hidden on mobile via lg:hidden classes)
  const [contentType, setContentType] = useState<ContentType>('confessions');
  const [kahaniyaFilter, setKahaniyaFilter] = useState<KahaniyaFilter>('trending');

  // Build the feed endpoint
  // DEFAULT: /feed shows TRENDING content for better engagement
  // Latest is available via /feed/latest filter
  // For Kahaniya mode (web-only), use dedicated endpoint with tag filtering
  const feedEndpoint = useMemo(() => {
    // If Kahaniya mode is active (web-only), use Kahaniya/stories endpoint
    // This filters posts by adult story tags (sexual-confession, fantasy-kinks, etc.)
    if (contentType === 'kahaniya' && !isTagPage) {
      return `/feed/kahaniya?sort=${kahaniyaFilter}`;
    }

    if (tag) {
      return `/feed/tag/${tag}?sort=${tagSort}`;
    }
    switch (filter) {
      case 'latest':
        return '/feed/latest';
      case 'trending':
        return '/feed/trending';
      case 'relatable':
        return '/feed/most-relatable';
      case 'commented':
        return '/feed/most-commented';
      case 'night':
        return '/feed/night-mode';
      default:
        // Default feed shows trending content
        return '/feed';
    }
  }, [filter, tag, tagSort, contentType, kahaniyaFilter, isTagPage]);

  // Use pagination hook with preloading and stale-while-revalidate
  const {
    items: posts,
    pagination,
    currentPage,
    isLoading,
    isStale,
    error,
    goToPage,
    refresh,
  } = usePagination<Post>({
    endpoint: feedEndpoint,
    itemsPerPage: 15,
    transformData: transformPosts,
  });

  // Handle create post action
  const handleCreatePost = () => {
    if (!isAuthenticated) {
      openAuthModal(() => router.push('/create'));
      return;
    }
    router.push('/create');
  };

  const getTitle = (): string => {
    // If in Kahaniya mode, don't show title (handled by Kahaniya header)
    if (contentType === 'kahaniya' && !isTagPage) {
      return '';
    }

    if (tag) {
      const info = tagInfo[tag];
      return info ? info.label : tag.replace(/-/g, ' ');
    }

    switch (filter) {
      case 'latest':
        return 'Latest Confessions';
      case 'trending':
        return 'Trending';
      case 'relatable':
        return 'Most Relatable';
      case 'commented':
        return 'Most Discussed';
      case 'night':
        return 'Night Mode';
      default:
        // Default is trending
        return 'Trending';
    }
  };

  // Tag page header component
  const TagPageHeader = () => {
    if (!tag) return null;
    const info = tagInfo[tag];

    return (
      <div className="card mb-6">
        {/* Back button */}
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 text-dark-400 hover:text-primary-400 mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Feed
        </Link>

        {/* Tag header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-primary-600/20 flex items-center justify-center">
            <Hash size={24} className="text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{info?.label || tag.replace(/-/g, ' ')}</h1>
            {info?.description && (
              <p className="text-dark-400 text-sm">{info.description}</p>
            )}
          </div>
        </div>

        {/* Sort tabs - Reddit style */}
        <div className="flex flex-wrap gap-2 mt-4 border-t border-dark-800 pt-4 overflow-x-hidden">
          <button
            onClick={() => setTagSort('latest')}
            className={clsx(
              'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0',
              tagSort === 'latest'
                ? 'bg-primary-600 text-white'
                : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
            )}
          >
            <Clock size={16} />
            New
          </button>
          <button
            onClick={() => setTagSort('trending')}
            className={clsx(
              'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0',
              tagSort === 'trending'
                ? 'bg-primary-600 text-white'
                : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
            )}
          >
            <TrendingUp size={16} />
            Hot
          </button>
          <button
            onClick={() => setTagSort('top')}
            className={clsx(
              'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0',
              tagSort === 'top'
                ? 'bg-primary-600 text-white'
                : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
            )}
          >
            <Heart size={16} />
            Top
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Web-only: Content Type Toggle (Confessions / Kahaniya) - Hidden on mobile */}
      {!isTagPage && (
        <div className="hidden lg:block">
          <div className="bg-dark-900 rounded-xl p-1.5 inline-flex gap-1">
            <button
              onClick={() => setContentType('confessions')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                contentType === 'confessions'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                  : 'text-dark-300 hover:text-dark-100 hover:bg-dark-800'
              )}
            >
              <MessageCircle size={18} />
              <span className={isHindiLang ? 'font-hindi' : isPunjabiLang ? 'font-punjabi' : ''}>
                {isHindiLang ? 'कन्फेशन' : isPunjabiLang ? 'ਇਕਰਾਰ' : 'Confessions'}
              </span>
            </button>
            <button
              onClick={() => setContentType('kahaniya')}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                contentType === 'kahaniya'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-dark-300 hover:text-orange-400 hover:bg-dark-800'
              )}
            >
              <Flame size={18} />
              <span className={isHindiLang ? 'font-hindi' : isPunjabiLang ? 'font-punjabi' : ''}>
                {isHindiLang ? 'कहानियाँ' : isPunjabiLang ? 'ਕਹਾਣੀਆਂ' : 'Stories'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Tag Page Header (if on tag page) */}
      {isTagPage && tag && <TagPageHeader />}

      {/* Kahaniya Header - Web only, shown when Stories tab is active */}
      {!isTagPage && contentType === 'kahaniya' && (
        <div className="hidden lg:block">
          <div className="rounded-xl p-4 sm:p-6 mb-2 bg-gradient-to-br from-orange-900/30 to-red-900/20 border border-orange-500/30">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-2xl sm:text-4xl w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full flex-shrink-0 bg-gradient-to-br from-orange-500/30 to-red-500/30">
                  <Flame className="text-orange-400" size={28} />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className={clsx(
                    'text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent',
                    isHindiLang && 'font-hindi',
                    isPunjabiLang && 'font-punjabi'
                  )}>
                    {isHindiLang ? 'हॉट कहानियाँ' : isPunjabiLang ? 'ਹੌਟ ਕਹਾਣੀਆਂ' : 'Hot Stories'}
                  </h1>
                  <p className={clsx(
                    'text-dark-300 text-sm sm:text-base mb-1 sm:mb-2 line-clamp-2',
                    isHindiLang && 'font-hindi',
                    isPunjabiLang && 'font-punjabi'
                  )}>
                    {isHindiLang
                      ? 'हॉट और ट्रेंडिंग कन्फेशन। सबसे दिलचस्प कहानियाँ।'
                      : isPunjabiLang
                        ? 'ਹੌਟ ਅਤੇ ਟ੍ਰੈਂਡਿੰਗ ਇਕਰਾਰ। ਸਭ ਤੋਂ ਦਿਲਚਸਪ ਕਹਾਣੀਆਂ।'
                        : 'Hot and trending confessions. The most interesting stories curated for you.'}
                  </p>
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-dark-400">
                    <span className="flex items-center gap-1 text-orange-400">
                      <Flame size={14} />
                      {isHindiLang ? 'क्यूरेटेड कंटेंट' : isPunjabiLang ? 'ਕਿਊਰੇਟਿਡ ਕੰਟੈਂਟ' : 'Curated Content'}
                    </span>
                  </div>
                </div>
              </div>
              {/* Create Post Button */}
              <button
                onClick={handleCreatePost}
                className="flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:from-orange-600 hover:to-red-600 transition-all"
              >
                <PlusCircle size={18} />
                <span className={clsx('text-sm sm:text-base', isHindiLang && 'font-hindi', isPunjabiLang && 'font-punjabi')}>
                  {isHindiLang ? 'कन्फेस करें' : isPunjabiLang ? 'ਇਕਰਾਰ ਕਰੋ' : 'Confess Now'}
                </span>
              </button>
            </div>
          </div>

          {/* Kahaniya Filters */}
          <div className="bg-dark-900 rounded-xl p-3 sm:p-4">
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap scrollbar-hide -mx-1 px-1">
              {kahaniFilters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setKahaniyaFilter(f.id as KahaniyaFilter)}
                  className={clsx(
                    'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg whitespace-nowrap transition-colors min-h-[44px] text-sm sm:text-base flex-shrink-0 sm:flex-shrink',
                    kahaniyaFilter === f.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                  )}
                >
                  <f.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className={isHindiLang ? 'font-hindi' : isPunjabiLang ? 'font-punjabi' : ''}>
                    {isHindiLang ? f.labelHi : isPunjabiLang ? f.labelPa : f.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Regular Header - Desktop (if not on tag page and in Confessions mode) */}
      {!isTagPage && contentType === 'confessions' && (
        <div className="hidden lg:flex items-center justify-between">
          <h1 className="text-2xl font-bold">{getTitle()}</h1>
          {filter === 'night' && (
            <span className="badge-primary">
              10 PM - 2 AM Special
            </span>
          )}
        </div>
      )}

      {/* Mobile: Regular Header (always show, since toggle is hidden on mobile) */}
      {!isTagPage && (
        <div className="lg:hidden flex items-center justify-between">
          <h1 className="text-2xl font-bold">{getTitle() || 'Trending'}</h1>
          {filter === 'night' && (
            <span className="badge-primary">
              10 PM - 2 AM Special
            </span>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card bg-red-900/20 border-red-700/50 text-red-300 text-center py-8">
          <p>{error}</p>
          <button
            onClick={refresh}
            className="btn-secondary mt-4"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State - Show skeletons only when no stale data available */}
      {isLoading && posts.length === 0 && (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Posts List - Shows immediately with stale data, updates when fresh data arrives */}
      {posts.length > 0 && (
        <div className={clsx(
          'space-y-4',
          isStale && 'opacity-70 transition-opacity duration-200'
        )}>
          {/* Stale data indicator - subtle loading bar at top */}
          {isStale && (
            <div className="h-0.5 bg-dark-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 animate-pulse w-full" />
            </div>
          )}
          {posts.map((post, index) => (
            <div
              key={post._id}
              className="animate-fade-in"
              style={{ animationDelay: `${Math.min(index * 30, 150)}ms` }}
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && pagination && pagination.pages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={goToPage}
          isLoading={isLoading}
        />
      )}

      {/* Empty State */}
      {!isLoading && posts.length === 0 && !error && (
        <div className={clsx(
          'card text-center py-16 animate-fade-in',
          contentType === 'kahaniya' && 'bg-dark-900'
        )}>
          <div className={clsx(
            'w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center',
            contentType === 'kahaniya' ? 'bg-orange-900/30' : 'bg-dark-800'
          )}>
            {contentType === 'kahaniya' ? (
              <Flame size={32} className="text-orange-400" />
            ) : (
              <MessageSquare size={32} className="text-dark-500" />
            )}
          </div>
          <h3 className={clsx(
            'text-xl font-semibold text-dark-200 mb-2',
            isHindiLang && 'font-hindi',
            isPunjabiLang && 'font-punjabi'
          )}>
            {contentType === 'kahaniya'
              ? (isHindiLang ? 'अभी कोई हॉट कहानी नहीं' : isPunjabiLang ? 'ਅਜੇ ਕੋਈ ਹੌਟ ਕਹਾਣੀ ਨਹੀਂ' : 'No hot stories yet')
              : (isHindiLang ? 'अभी कोई कन्फेशन नहीं' : isPunjabiLang ? 'ਅਜੇ ਕੋਈ ਇਕਰਾਰ ਨਹੀਂ' : 'No confessions yet')}
          </h3>
          <p className={clsx(
            'text-dark-400 mb-6 max-w-sm mx-auto',
            isHindiLang && 'font-hindi',
            isPunjabiLang && 'font-punjabi'
          )}>
            {isHindiLang
              ? 'पहले व्यक्ति बनें अपनी कहानी साझा करने वाले'
              : isPunjabiLang
                ? 'ਆਪਣੀ ਕਹਾਣੀ ਸਾਂਝੀ ਕਰਨ ਵਾਲੇ ਪਹਿਲੇ ਬਣੋ'
                : 'Be the first to share your story with the community'}
          </p>
          {contentType === 'kahaniya' ? (
            <button
              onClick={handleCreatePost}
              className="min-h-[44px] text-sm sm:text-base px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:from-orange-600 hover:to-red-600 transition-all inline-flex items-center gap-2"
            >
              <PlusCircle size={18} />
              {isHindiLang ? 'पहली पोस्ट करें!' : isPunjabiLang ? 'ਪਹਿਲੀ ਪੋਸਟ ਕਰੋ!' : 'Be the first to post!'}
            </button>
          ) : (
            <Link href="/create" className="btn-primary inline-flex items-center gap-2">
              <Plus size={18} />
              {isHindiLang ? 'कन्फेशन लिखें' : isPunjabiLang ? 'ਇਕਰਾਰ ਲਿਖੋ' : 'Write a Confession'}
            </Link>
          )}
        </div>
      )}

      {/* Footer - show after posts */}
      {!isLoading && posts.length > 0 && <Footer />}
    </div>
  );
}
