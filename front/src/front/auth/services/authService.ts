/**
 * Front 영역 전용 인증 서비스
 */

import apiClient from '../../../core/http/axios';
import env from '../../../core/config/env';
import { 
  FrontLoginRequest, 
  FrontRegisterRequest, 
  FrontAuthResponse, 
  FrontUser,
  FrontUserPreferences,
  FrontNotificationSettings,
  FrontPrivacySettings
} from '../types/auth';

// Mock 사용자 데이터
const mockUsers = [
  {
    id: '1',
    name: '김사용자',
    email: 'user@toss.com',
    password: 'user123',
    role: 'user' as const,
    profile: {
      nickname: '토스러버',
      phone: '010-1234-5678',
      birthDate: '1990-01-01',
      gender: 'male' as const,
      bio: '토스를 사랑하는 사용자입니다!',
    },
    preferences: {
      language: 'ko',
      timezone: 'Asia/Seoul',
      notifications: {
        email: true,
        push: true,
        sms: false,
        marketing: false,
        updates: true,
      },
      privacy: {
        profileVisibility: 'friends' as const,
        showEmail: false,
        showPhone: false,
        showBirthDate: false,
      },
      theme: 'light' as const,
    },
    avatar: 'https://via.placeholder.com/100x100/34a853/ffffff?text=User',
    lastLoginAt: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isVerified: true,
  },
];

// Mock 사용자 로그인
const mockUserLogin = async (email: string, password: string): Promise<FrontAuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        resolve({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profile: user.profile,
            preferences: user.preferences,
            avatar: user.avatar,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            isVerified: user.isVerified,
          },
          token: `user-token-${user.id}-${Date.now()}`,
          expiresIn: 7200, // 2시간
        });
      } else {
        reject(new Error('이메일 또는 비밀번호가 올바르지 않습니다.'));
      }
    }, 1000);
  });
};

// Mock 사용자 회원가입
const mockUserRegister = async (data: FrontRegisterRequest): Promise<FrontAuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingUser = mockUsers.find(u => u.email === data.email);
      
      if (existingUser) {
        reject(new Error('이미 존재하는 이메일입니다.'));
        return;
      }

      if (data.password !== data.confirmPassword) {
        reject(new Error('비밀번호가 일치하지 않습니다.'));
        return;
      }

      if (!data.termsAccepted || !data.privacyAccepted) {
        reject(new Error('약관에 동의해야 합니다.'));
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'user' as const,
        profile: {
          nickname: data.name,
          phone: '',
          birthDate: '',
          gender: 'male' as const,
          bio: '',
        },
        preferences: {
          language: 'ko',
          timezone: 'Asia/Seoul',
          notifications: {
            email: true,
            push: true,
            sms: false,
            marketing: false,
            updates: true,
          },
          privacy: {
            profileVisibility: 'friends' as const,
            showEmail: false,
            showPhone: false,
            showBirthDate: false,
          },
          theme: 'light' as const,
        },
        avatar: `https://via.placeholder.com/100x100/ff6b6b/ffffff?text=${data.name.charAt(0)}`,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVerified: false,
      };

      mockUsers.push(newUser);

      resolve({
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          profile: newUser.profile,
          preferences: newUser.preferences,
          avatar: newUser.avatar,
          lastLoginAt: newUser.lastLoginAt,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
          isVerified: newUser.isVerified,
        },
        token: `user-token-${newUser.id}-${Date.now()}`,
        expiresIn: 7200,
      });
    }, 1000);
  });
};

// Mock 현재 사용자 조회
const mockGetCurrentUser = async (): Promise<FrontUser> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const token = localStorage.getItem('front-auth-storage');
      if (!token) {
        reject(new Error('사용자 토큰이 없습니다.'));
        return;
      }

      try {
        const authData = JSON.parse(token);
        const userId = authData.state?.user?.id;
        const user = mockUsers.find(u => u.id === userId);
        
        if (user) {
          resolve({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profile: user.profile,
            preferences: user.preferences,
            avatar: user.avatar,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            isVerified: user.isVerified,
          });
        } else {
          reject(new Error('사용자를 찾을 수 없습니다.'));
        }
      } catch (error) {
        reject(new Error('사용자 토큰이 유효하지 않습니다.'));
      }
    }, 500);
  });
};

// 실제 API 호출 함수들
const userLogin = async (data: FrontLoginRequest): Promise<FrontAuthResponse> => {
  console.log('🔍 Front 로그인 시도:', { 
    email: data.email, 
    useMock: env.REACT_APP_USE_MOCK,
    env: env.REACT_APP_ENV,
    nodeEnv: process.env.NODE_ENV
  });
  
  if (env.REACT_APP_USE_MOCK) {
    console.log('📝 Mock 데이터로 로그인 처리');
    return mockUserLogin(data.email, data.password);
  }

  console.log('🌐 실제 API로 로그인 처리');
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

const userRegister = async (data: FrontRegisterRequest): Promise<FrontAuthResponse> => {
  if (env.REACT_APP_USE_MOCK) {
    return mockUserRegister(data);
  }

  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

const getCurrentUser = async (): Promise<FrontUser> => {
  if (env.REACT_APP_USE_MOCK) {
    return mockGetCurrentUser();
  }

  const response = await apiClient.get('/auth/me');
  return response.data;
};

const userLogout = async (): Promise<void> => {
  if (env.REACT_APP_USE_MOCK) {
    return Promise.resolve();
  }

  await apiClient.post('/auth/logout');
};

const setUserToken = (token: string): void => {
  apiClient.defaults.headers.common['X-User-Token'] = `Bearer ${token}`;
};

const frontAuthService = {
  login: userLogin,
  register: userRegister,
  getCurrentUser,
  logout: userLogout,
  setToken: setUserToken,
};

export default frontAuthService;