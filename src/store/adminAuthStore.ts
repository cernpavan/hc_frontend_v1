'use client';

import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'subadmin';
  permissions: {
    canManagePosts?: boolean;
    canManageUsers?: boolean;
    canManageReports?: boolean;
    canManageSubAdmins?: boolean;
    canViewAnalytics?: boolean;
  };
}

interface AdminAuthState {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;

  // Actions
  login: (admin: AdminUser, token: string) => void;
  logout: () => void;
  hasPermission: (permission: keyof AdminUser['permissions']) => boolean;
  setHasHydrated: (state: boolean) => void;
}

type AdminPersist = Pick<AdminAuthState, 'admin' | 'token' | 'isAuthenticated'>;

const storeCreator: StateCreator<AdminAuthState, [], [], AdminAuthState> = (set, get) => ({
  admin: null,
  token: null,
  isAuthenticated: false,
  _hasHydrated: false,

  setHasHydrated: (state) => {
    set({ _hasHydrated: state });
  },

  login: (admin, token) =>
    set({
      admin,
      token,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      admin: null,
      token: null,
      isAuthenticated: false,
    }),

  hasPermission: (permission) => {
    const { admin } = get();
    if (!admin) return false;
    if (admin.role === 'admin') return true; // Admin has all permissions
    return admin.permissions[permission] === true;
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

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(storeCreator, {
    name: 'hindi-confession-admin-auth',
    storage: createJSONStorage(getStorage),
    partialize: (state): AdminPersist => ({
      admin: state.admin,
      token: state.token,
      isAuthenticated: state.isAuthenticated,
    }),
    onRehydrateStorage: () => (state) => {
      state?.setHasHydrated(true);
    },
    skipHydration: true,
  })
);

// Manual hydration for client-side only
if (typeof window !== 'undefined') {
  useAdminAuthStore.persist.rehydrate();
}
