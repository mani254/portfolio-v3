import { create } from 'zustand';
import { AuthUser, AuthActions } from './types';
import { useUserStore } from './userStore';
import api from '@/lib/api';
import { AxiosError } from 'axios';

export const useAuthStore = create<AuthActions>(() => ({
  login: async (email, password) => {
    useUserStore.getState().setLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const data = response.data;
      const user = data.data as AuthUser;
      
      useUserStore.getState().setUser(user);
      // Store userId as sessionId for persistent chat
      localStorage.setItem('portfolio_chat_session_id', user._id);
      
      useUserStore.getState().setLoading(false);
      return { ok: true, user };
    } catch (error) {
      useUserStore.getState().setLoading(false);
      const axiosError = error as AxiosError<any>;
      return { 
        ok: false, 
        status: axiosError.response?.status, 
        message: axiosError.response?.data?.message || 'Login failed',
        data: axiosError.response?.data?.data
      };
    }
  },

  register: async (name, email, password) => {
    useUserStore.getState().setLoading(true);
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      const data = response.data;
      const user = data.data as AuthUser;
      
      if (user?._id) {
        localStorage.setItem('portfolio_chat_session_id', user._id);
      }
      
      useUserStore.getState().setLoading(false);
      return { ok: true, message: data.message, data: data.data };
    } catch (error) {
      useUserStore.getState().setLoading(false);
      const axiosError = error as AxiosError<any>;
      return { 
        ok: false, 
        message: axiosError.response?.data?.message || 'Registration failed',
        data: axiosError.response?.data?.data 
      };
    }
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      useUserStore.getState().clearUser();
      // Optional: regenerate a new anonymous session ID for privacy
      const newAnonId = `anon_${crypto.randomUUID()}`;
      localStorage.setItem('portfolio_chat_session_id', newAnonId);
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const response = await api.post('/api/otp/verify', { email, otp, type: 'email_verification' });
      const data = response.data;
      return { ok: true, message: data.message, verified: data.data?.verified };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return { 
        ok: false, 
        message: axiosError.response?.data?.message || 'Verification failed',
        verified: false 
      };
    }
  },

  resendOtp: async (email) => {
    try {
      const response = await api.post('/api/otp/resend', { email, type: 'email_verification' });
      const data = response.data;
      return { ok: true, message: data.message };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return { 
        ok: false, 
        message: axiosError.response?.data?.message || 'Failed to resend code' 
      };
    }
  },

  loginWithGoogle: async (redirectUrl?: string) => {
    try {
      const response = await api.get(`/api/auth/google${redirectUrl ? `?redirectUrl=${encodeURIComponent(redirectUrl)}` : ''}`);
      const data = response.data as { authUrl: string };
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Google Auth initiation failed:', error);
    }
  },
}));
