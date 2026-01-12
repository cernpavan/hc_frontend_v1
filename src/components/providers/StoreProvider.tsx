'use client';

import { useEffect, ReactNode } from 'react';
import { useSearchStore } from '@/store/searchStore';

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  // Initialize stores that need client-side data
  useEffect(() => {
    // Initialize recent searches from localStorage
    useSearchStore.getState().initRecentSearches();
  }, []);

  return <>{children}</>;
}
