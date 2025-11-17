/**
 * Admin 영역 전용 인증 서비스
 */

import apiClient from '../../../core/http/axios';
import env from '../../../core/config/env';
import { AdminLoginRequest, AdminAuthResponse, AdminUser, AdminPermission } from '../types/auth';

// Mock 관리자 데이터
const mockAdmins = [
  {
    id: '1',
    name: '시스템 관리자',
    email: 'admin@toss.com',
    password: 'admin123',
    role: 'super_admin' as const,
    permissions: [
      { id: '1', name: '사용자 관리', resource: 'users', action: 'all' },
      { id: '2', name: '대시보드 접근', resource: 'dashboard', action: 'read' },
      { id: '3', name: '시스템 설정', resource: 'settings', action: 'all' },
    ],
    department: 'IT팀',
    avatar: 'https://via.placeholder.com/100x100/4285f4/ffffff?text=Admin',
    lastLoginAt: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isActive: true,
  },
];

// Mock 관리자 로그인
const mockAdminLogin = async (email: string, password: string): Promise<AdminAuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const admin = mockAdmins.find(a => a.email === email && a.password === password);
      
      if (admin) {
        resolve({
          admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions,
            department: admin.department,
            avatar: admin.avatar,
            lastLoginAt: admin.lastLoginAt,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
            isActive: admin.isActive,
          },
          token: `admin-token-${admin.id}-${Date.now()}`,
          refreshToken: `admin-refresh-${admin.id}-${Date.now()}`,
          expiresIn: 3600, // 1시간
        });
      } else {
        reject(new Error('관리자 이메일 또는 비밀번호가 올바르지 않습니다.'));
      }
    }, 1000);
  });
};

// Mock 관리자 정보 조회
const mockGetCurrentAdmin = async (): Promise<AdminUser> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const token = localStorage.getItem('admin-auth-storage');
      if (!token) {
        reject(new Error('관리자 토큰이 없습니다.'));
        return;
      }

      try {
        const authData = JSON.parse(token);
        const adminId = authData.state?.admin?.id;
        const admin = mockAdmins.find(a => a.id === adminId);
        
        if (admin) {
          resolve({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions,
            department: admin.department,
            avatar: admin.avatar,
            lastLoginAt: admin.lastLoginAt,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
            isActive: admin.isActive,
          });
        } else {
          reject(new Error('관리자를 찾을 수 없습니다.'));
        }
      } catch (error) {
        reject(new Error('관리자 토큰이 유효하지 않습니다.'));
      }
    }, 500);
  });
};

// 실제 API 호출 함수들
const adminLogin = async (data: AdminLoginRequest): Promise<AdminAuthResponse> => {
  console.log('🔍 Admin 로그인 시도:', { 
    email: data.email, 
    useMock: env.REACT_APP_USE_MOCK,
    env: env.REACT_APP_ENV,
    nodeEnv: process.env.NODE_ENV
  });
  
  if (env.REACT_APP_USE_MOCK) {
    console.log('📝 Mock 데이터로 로그인 처리');
    return mockAdminLogin(data.email, data.password);
  }

  console.log('🌐 실제 API로 로그인 처리');
  console.log('📍 API Base URL:', apiClient.defaults.baseURL);
  console.log('📍 요청 URL:', `${apiClient.defaults.baseURL}/auth/admin/login`);
  const response = await apiClient.post('/auth/admin/login', data);
  return response.data;
};

const getCurrentAdmin = async (): Promise<AdminUser> => {
  if (env.REACT_APP_USE_MOCK) {
    return mockGetCurrentAdmin();
  }

  const response = await apiClient.get('/auth/admin/me');
  return response.data;
};

const refreshAdminToken = async (refreshToken: string): Promise<{ token: string; expiresIn: number }> => {
  if (env.REACT_APP_USE_MOCK) {
    return Promise.resolve({
      token: `admin-token-refreshed-${Date.now()}`,
      expiresIn: 3600,
    });
  }

  const response = await apiClient.post('/auth/admin/refresh', { refreshToken });
  return response.data;
};

const adminLogout = async (): Promise<void> => {
  if (env.REACT_APP_USE_MOCK) {
    return Promise.resolve();
  }

  await apiClient.post('/auth/admin/logout');
};

const setAdminToken = (token: string): void => {
  apiClient.defaults.headers.common['X-Admin-Token'] = `Bearer ${token}`;
};

const adminAuthService = {
  login: adminLogin,
  getCurrentAdmin,
  refreshToken: refreshAdminToken,
  logout: adminLogout,
  setToken: setAdminToken,
};

export default adminAuthService;
