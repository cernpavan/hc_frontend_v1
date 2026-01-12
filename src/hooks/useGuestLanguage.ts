'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

type Language = 'hindi' | 'english' | 'punjabi';

const DEFAULT_LANGUAGE: Language = 'hindi';
const STORAGE_KEY = 'guest-language';

/**
 * SSR-safe hook for getting the current language
 * Returns the user's language if authenticated, otherwise guest language from localStorage
 */
export function useCurrentLanguage(): Language {
  const { user, isAuthenticated } = useAuthStore();
  const [guestLanguage, setGuestLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined' && !isAuthenticated) {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored && ['hindi', 'english', 'punjabi'].includes(stored)) {
        setGuestLanguage(stored);
      }
    }
  }, [isAuthenticated]);

  // During SSR or before hydration, return default
  if (!isMounted) {
    return DEFAULT_LANGUAGE;
  }

  return isAuthenticated ? (user?.language || DEFAULT_LANGUAGE) : guestLanguage;
}

/**
 * SSR-safe function to get guest language (for use in event handlers)
 */
export function getGuestLanguage(): Language {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }
  const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (stored && ['hindi', 'english', 'punjabi'].includes(stored)) {
    return stored;
  }
  return DEFAULT_LANGUAGE;
}

/**
 * SSR-safe function to set guest language
 */
export function setGuestLanguage(language: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, language);
  }
}
