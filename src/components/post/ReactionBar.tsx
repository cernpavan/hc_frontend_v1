'use client';

import { useState, memo, useCallback } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { Post } from '@/types';
import { apiPost, apiDelete } from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

interface ReactionBarProps {
  post: Post;
}

const reactions = [
  { type: 'relatable', emoji: '😳', label: 'Relatable', labelHi: 'रिलेटेबल', labelPa: 'ਸੰਬੰਧਤ' },
  { type: 'hot', emoji: '🔥', label: 'Hot', labelHi: 'हॉट', labelPa: 'ਹੌਟ' },
  { type: 'feltThis', emoji: '🤍', label: 'Felt this', labelHi: 'महसूस किया', labelPa: 'ਮਹਿਸੂਸ ਕੀਤਾ' },
  { type: 'curious', emoji: '🤔', label: 'Curious', labelHi: 'उत्सुक', labelPa: 'ਉਤਸੁਕ' },
  { type: 'sad', emoji: '😢', label: 'Sad', labelHi: 'दुखी', labelPa: 'ਉਦਾਸ' },
  { type: 'tooMuch', emoji: '🙈', label: 'Intense', labelHi: 'तीव्र', labelPa: 'ਤੀਬਰ' },
];

function ReactionBarComponent({ post }: ReactionBarProps) {
  const { user, isAuthenticated } = useAuthStore();
  const currentLanguage = isAuthenticated ? user?.language : (typeof window !== 'undefined' ? localStorage.getItem('guest-language') : null) || 'hindi';
  const isHindiLang = currentLanguage === 'hindi';
  const isPunjabiLang = currentLanguage === 'punjabi';

  const [counts, setCounts] = useState(post.reactionCounts || {
    relatable: 0,
    hot: 0,
    feltThis: 0,
    curious: 0,
    sad: 0,
    tooMuch: 0,
  });
  const [myReaction, setMyReaction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReaction = useCallback(async (reactionType: string) => {
    if (isLoading) return;

    const previousReaction = myReaction;
    const previousCounts = { ...counts };

    // Optimistically update UI immediately
    if (myReaction === reactionType) {
      // Remove reaction
      setCounts((prev) => ({
        ...prev,
        [reactionType]: Math.max(0, prev[reactionType as keyof typeof prev] - 1),
      }));
      setMyReaction(null);
    } else {
      // Add/change reaction
      const newCounts = { ...counts };
      if (myReaction) {
        // Decrement old reaction
        newCounts[myReaction as keyof typeof newCounts] = Math.max(0, newCounts[myReaction as keyof typeof newCounts] - 1);
      }
      // Increment new reaction
      newCounts[reactionType as keyof typeof newCounts] = newCounts[reactionType as keyof typeof newCounts] + 1;
      setCounts(newCounts);
      setMyReaction(reactionType);
    }

    setIsLoading(true);
    try {
      if (previousReaction === reactionType) {
        // Remove reaction API call
        await apiDelete(`/reactions/post/${post._id}`);
      } else {
        // Add/change reaction API call
        await apiPost(`/reactions/post/${post._id}`, { reactionType });
      }
    } catch (error) {
      toast.error('Failed to react');
      // Revert optimistic update on error
      setCounts(previousCounts);
      setMyReaction(previousReaction);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, myReaction, counts, post._id]);

  const totalReactions = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;

  // Sort reactions by count for progressive disclosure
  const sortedReactions = [...reactions].sort((a, b) => {
    const countA = counts[a.type as keyof typeof counts] || 0;
    const countB = counts[b.type as keyof typeof counts] || 0;
    return countB - countA;
  });

  // Show top 3 reactions by default, all when expanded
  const visibleReactions = isExpanded ? reactions : sortedReactions.slice(0, 3);
  const hiddenCount = reactions.length - 3;

  return (
    <div className="flex flex-wrap items-center gap-1 md:gap-2">
      {visibleReactions.map((reaction) => {
        const count = counts[reaction.type as keyof typeof counts] || 0;
        const isActive = myReaction === reaction.type;

        return (
          <button
            key={reaction.type}
            onClick={() => handleReaction(reaction.type)}
            disabled={isLoading}
            className={clsx(
              'reaction-btn',
              isActive && 'reaction-btn-active reaction-selected'
            )}
            title={isHindiLang ? reaction.labelHi : isPunjabiLang ? reaction.labelPa : reaction.label}
            aria-label={`${isHindiLang ? reaction.labelHi : isPunjabiLang ? reaction.labelPa : reaction.label}${count > 0 ? ` (${count})` : ''}`}
          >
            <span className="text-sm md:text-base">{reaction.emoji}</span>
            {count > 0 && <span className="text-[10px] md:text-xs font-medium">{count}</span>}
          </button>
        );
      })}

      {/* Expand button for more reactions */}
      {!isExpanded && hiddenCount > 0 && (
        <button
          onClick={() => setIsExpanded(true)}
          className="reaction-btn text-dark-400"
          aria-label="Show more reactions"
        >
          <ChevronDown size={14} className="md:w-4 md:h-4" />
          <span className="text-[10px] md:text-xs">+{hiddenCount}</span>
        </button>
      )}

      {/* Is This Normal Indicator - hidden on mobile for space */}
      {totalReactions >= 5 && (
        <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-dark-800/50 border border-dark-700/50">
          <span className={`text-xs text-dark-400 ${isHindiLang ? 'font-hindi' : isPunjabiLang ? 'font-punjabi' : ''}`}>
            {counts.relatable > totalReactions * 0.5
              ? isHindiLang ? '✓ बहुत लोग रिलेट करते हैं' : isPunjabiLang ? '✓ ਬਹੁਤ ਲੋਕ ਸੰਬੰਧਤ ਹਨ' : '✓ Many relate'
              : counts.tooMuch > totalReactions * 0.3
              ? isHindiLang ? '⚠ असामान्य' : isPunjabiLang ? '⚠ ਅਸਾਧਾਰਨ' : '⚠ Uncommon'
              : isHindiLang ? '≈ मिश्रित प्रतिक्रियाएं' : isPunjabiLang ? '≈ ਮਿਲੀ-ਜੁਲੀ ਪ੍ਰਤੀਕ੍ਰਿਆ' : '≈ Mixed reactions'}
          </span>
        </div>
      )}
    </div>
  );
}

// Memoize ReactionBar to prevent unnecessary re-renders
const ReactionBar = memo(ReactionBarComponent, (prevProps, nextProps) => {
  // Only re-render if post ID or reaction counts change
  const prevCounts = prevProps.post.reactionCounts;
  const nextCounts = nextProps.post.reactionCounts;

  return (
    prevProps.post._id === nextProps.post._id &&
    prevCounts.relatable === nextCounts.relatable &&
    prevCounts.hot === nextCounts.hot &&
    prevCounts.feltThis === nextCounts.feltThis &&
    prevCounts.curious === nextCounts.curious &&
    prevCounts.sad === nextCounts.sad &&
    prevCounts.tooMuch === nextCounts.tooMuch
  );
});

ReactionBar.displayName = 'ReactionBar';

export default ReactionBar;
