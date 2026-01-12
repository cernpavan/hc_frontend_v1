'use client';

import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  avatar?: string;
  language: 'hindi' | 'english' | 'punjabi';
  theme: 'light' | 'dark';
  showNsfw: boolean;
  usernameChangesLeft?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  ageVerified: boolean;
  showAuthModal: boolean;
  pendingAction: (() => void) | null;
  _hasHydrated: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  verifyAge: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLanguage: (language: 'hindi' | 'english' | 'punjabi') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setShowNsfw: (show: boolean) => void;
  setAvatar: (avatar: string) => void;
  openAuthModal: (pendingAction?: () => void) => void;
  closeAuthModal: () => void;
  executePendingAction: () => void;
  setHasHydrated: (state: boolean) => void;
}

type AuthPersist = Pick<AuthState, 'user' | 'token' | 'isAuthenticated' | 'ageVerified'>;

const storeCreator: StateCreator<AuthState, [], [], AuthState> = (set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  ageVerified: false,
  showAuthModal: false,
  pendingAction: null,
  _hasHydrated: false,

  setHasHydrated: (state) => {
    set({ _hasHydrated: state });
  },

  login: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),

  verifyAge: () =>
    set({
      ageVerified: true,
    }),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  setLanguage: (language) =>
    set((state) => ({
      user: state.user ? { ...state.user, language } : null,
    })),

  setTheme: (theme) =>
    set((state) => ({
      user: state.user ? { ...state.user, theme } : null,
    })),

  setShowNsfw: (showNsfw) =>
    set((state) => ({
      user: state.user ? { ...state.user, showNsfw } : null,
    })),

  setAvatar: (avatar) =>
    set((state) => ({
      user: state.user ? { ...state.user, avatar } : null,
    })),

  openAuthModal: (pendingAction) =>
    set({
      showAuthModal: true,
      pendingAction: pendingAction || null,
    }),

  closeAuthModal: () =>
    set({
      showAuthModal: false,
      pendingAction: null,
    }),

  executePendingAction: () => {
    const { pendingAction, isAuthenticated } = get();
    if (isAuthenticated && pendingAction) {
      pendingAction();
      set({ pendingAction: null });
    }
  },
});

// SSR-safe storage that only accesses localStorage when available
const getStorage = () => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }

  return localStorage;
};

export const useAuthStore = create<AuthState>()(
  persist(storeCreator, {
    name: 'hindi-confession-auth',
    storage: createJSONStorage(getStorage),
    partialize: (state): AuthPersist => ({
      user: state.user,
      token: state.token,
      isAuthenticated: state.isAuthenticated,
      ageVerified: state.ageVerified,
    }),
    onRehydrateStorage: () => (state) => {
      state?.setHasHydrated(true);
    },
    skipHydration: true,
  })
);

// Manual hydration for client-side only
if (typeof window !== 'undefined') {
  useAuthStore.persist.rehydrate();
}
