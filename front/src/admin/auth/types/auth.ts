/**
 * Admin 영역 전용 인증 타입 정의
 */

// 관리자 전용 사용자 정보
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  permissions: AdminPermission[];
  department: string;
  avatar?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
}

// 관리자 권한
export interface AdminPermission {
  id: string;
  name: string;
  resource: string; // 'users', 'dashboard', 'settings' 등
  action: string;   // 'read', 'write', 'delete' 등
}

// 관리자 로그인 요청
export interface AdminLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 관리자 인증 응답
export interface AdminAuthResponse {
  admin: AdminUser;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// 관리자 인증 상태
export interface AdminAuthState {
  admin: AdminUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: AdminPermission[];
}

// 관리자 세션 정보
export interface AdminSession {
  id: string;
  adminId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}
