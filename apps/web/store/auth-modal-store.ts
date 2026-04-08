import { create } from 'zustand';

type AuthView = 'login' | 'register';

interface AuthModalState {
  isOpen: boolean;
  view: AuthView;
  redirectUrl: string | null;
  openModal: (view?: AuthView, redirectUrl?: string) => void;
  closeModal: () => void;
  setView: (view: AuthView) => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  view: 'login',
  redirectUrl: null,
  openModal: (view = 'login', redirectUrl) => 
    set({ 
      isOpen: true, 
      view, 
      redirectUrl: redirectUrl || (typeof window !== 'undefined' ? window.location.pathname : null) 
    }),
  closeModal: () => set({ isOpen: false, redirectUrl: null }),
  setView: (view) => set({ view }),
}));
