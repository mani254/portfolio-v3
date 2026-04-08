import { create } from 'zustand';
import { AuthUser, UserState } from './types';
import api from '@/lib/api';

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  setUser: (user) => set({ user, isInitialized: true }),
  setLoading: (isLoading) => set({ isLoading }),
  clearUser: () => set({ user: null, isInitialized: true }),

  getCurrentUser: async () => {
    return await get().fetchMe();
  },

  fetchMe: async (): Promise<AuthUser | null> => {
    set({ isLoading: true });
    try {
      const response = await api.get('/api/auth/me');
      const data = response.data.data as AuthUser;
      
      set({ user: data, isLoading: false, isInitialized: true });
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      set({ user: null, isLoading: false, isInitialized: true });
      return null;
    }
  },
}));
