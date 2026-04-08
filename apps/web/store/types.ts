export interface AuthUser {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: string;
    emailVerified: boolean;
    provider: string;
}

export interface UserState {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (isLoading: boolean) => void;
  fetchMe: () => Promise<AuthUser | null>;
  getCurrentUser: () => Promise<AuthUser | null>;
  clearUser: () => void;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<{ ok: boolean; user?: AuthUser; status?: number; message?: string; data?: any }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; message: string; data?: any }>;
  logout: () => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<{ ok: boolean; message: string; verified: boolean }>;
  resendOtp: (email: string) => Promise<{ ok: boolean; message: string }>;
  loginWithGoogle: (redirectUrl?: string) => Promise<void>;
}
