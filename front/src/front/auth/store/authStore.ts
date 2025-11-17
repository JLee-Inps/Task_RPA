/**
 * Front 영역 전용 인증 상태 관리
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FrontAuthState, FrontUser } from '../types/auth';
import frontAuthService from '../services/authService';

interface FrontAuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  setToken: (token: string | null) => void;
  checkAuth: () => Promise<void>;
  updatePreferences: (preferences: any) => Promise<void>;
}

type FrontAuthStore = FrontAuthState & FrontAuthActions;

export const useFrontAuthStore = create<FrontAuthStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      preferences: null,

      // 액션들
      login: async (email: string, password: string) => {
        console.log('Front login called');
        set({ isLoading: true });
        try {
          const response = await frontAuthService.login({ email, password });
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            preferences: response.user.preferences,
          });

          frontAuthService.setToken(response.token);
        } catch (error: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            preferences: null,
          });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string, confirmPassword: string) => {
        console.log('Front register called');
        set({ isLoading: true });
        try {
          const response = await frontAuthService.register({
            name,
            email,
            password,
            confirmPassword,
            termsAccepted: true,
            privacyAccepted: true,
          });
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            preferences: response.user.preferences,
          });

          frontAuthService.setToken(response.token);
        } catch (error: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            preferences: null,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await frontAuthService.logout();
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            preferences: null,
          });
        }
      },

      setToken: (token: string | null) => {
        set({ token });
        if (token) {
          frontAuthService.setToken(token);
        }
      },

      checkAuth: async () => {
        console.log('Front checkAuth called');
        const { token, isAuthenticated, user } = get();
        console.log('Front current token:', token, 'isAuthenticated:', isAuthenticated);
        
        // 이미 인증되어 있고 사용자 정보가 있으면 스킵
        if (isAuthenticated && user && token) {
          console.log('Front already authenticated, skipping check');
          set({ isLoading: false });
          return;
        }
        
        // localStorage에서 먼저 확인
        const stored = localStorage.getItem('front-auth-storage');
        if (stored) {
          try {
            const authData = JSON.parse(stored);
            if (authData.state?.token && authData.state?.user) {
              console.log('Restoring auth state from localStorage');
              set({
                user: authData.state.user,
                token: authData.state.token,
                isAuthenticated: true,
                isLoading: false,
                preferences: authData.state.user.preferences || null,
              });
              frontAuthService.setToken(authData.state.token);
              return;
            }
          } catch (e) {
            console.error('Failed to parse stored auth data:', e);
          }
        }
        
        if (!token) {
          console.log('No front token, setting unauthenticated');
          set({ isAuthenticated: false, user: null, isLoading: false });
          return;
        }

        console.log('Front token exists, checking with server');
        set({ isLoading: true });
        try {
          const user = await frontAuthService.getCurrentUser();
          console.log('Front auth successful, user:', user);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            preferences: user.preferences,
          });
        } catch (error) {
          console.log('Front auth failed:', error);
          // 서버 확인 실패 시에도 localStorage에 데이터가 있으면 유지
          const stored = localStorage.getItem('front-auth-storage');
          if (stored) {
            try {
              const authData = JSON.parse(stored);
              if (authData.state?.token && authData.state?.user) {
                console.log('Keeping auth state from localStorage despite server check failure');
                set({
                  user: authData.state.user,
                  token: authData.state.token,
                  isAuthenticated: true,
                  isLoading: false,
                  preferences: authData.state.user.preferences || null,
                });
                frontAuthService.setToken(authData.state.token);
                return;
              }
            } catch (e) {
              console.error('Failed to parse stored auth data:', e);
            }
          }
          
          // localStorage에도 없으면 로그아웃
          frontAuthService.logout();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            preferences: null,
          });
        }
      },

      updatePreferences: async (preferences: any) => {
        const { user } = get();
        if (!user) return;

        const updatedUser = {
          ...user,
          preferences: {
            ...user.preferences,
            ...preferences,
          },
        };

        set({
          user: updatedUser,
          preferences: updatedUser.preferences,
        });
      },
    }),
    {
      name: 'front-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        preferences: state.preferences,
      }),
    }
  )
);
