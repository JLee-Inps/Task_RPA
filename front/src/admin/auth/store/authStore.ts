/**
 * Admin 영역 전용 인증 상태 관리
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminAuthState, AdminUser } from '../types/auth';
import adminAuthService from '../services/authService';

interface AdminAuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setToken: (token: string | null) => void;
  checkAuth: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
}

type AdminAuthStore = AdminAuthState & AdminAuthActions;

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      admin: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      permissions: [],

      // 액션들
      login: async (email: string, password: string) => {
        console.log('Admin login called');
        set({ isLoading: true });
        try {
          const response = await adminAuthService.login({ email, password });
          
          set({
            admin: response.admin,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            permissions: response.admin.permissions,
          });

          adminAuthService.setToken(response.token);
        } catch (error: any) {
          set({
            admin: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            permissions: [],
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await adminAuthService.logout();
        } finally {
          set({
            admin: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            permissions: [],
          });
        }
      },

      setToken: (token: string | null) => {
        set({ token });
        if (token) {
          adminAuthService.setToken(token);
        }
      },

      checkAuth: async () => {
        console.log('Admin checkAuth called');
        const { token } = get();
        console.log('Admin current token:', token);
        
        if (!token) {
          console.log('No admin token, setting unauthenticated');
          set({ isAuthenticated: false, admin: null, isLoading: false });
          return;
        }

        console.log('Admin token exists, checking with server');
        set({ isLoading: true });
        try {
          const admin = await adminAuthService.getCurrentAdmin();
          console.log('Admin auth successful, admin:', admin);
          set({
            admin,
            isAuthenticated: true,
            isLoading: false,
            permissions: admin.permissions,
          });
        } catch (error) {
          console.log('Admin auth failed, clearing token:', error);
          adminAuthService.logout();
          set({
            admin: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            permissions: [],
          });
        }
      },

      refreshAuthToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          throw new Error('Refresh token not found');
        }

        try {
          const response = await adminAuthService.refreshToken(refreshToken);
          set({
            token: response.token,
            isAuthenticated: true,
          });
          adminAuthService.setToken(response.token);
        } catch (error) {
          set({
            admin: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            permissions: [],
          });
          throw error;
        }
      },
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
