/**
 * 역할(Role) 상수 정의
 */

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// 역할별 권한 정의
export const PERMISSIONS = {
  [ROLES.ADMIN]: [
    'user:read',
    'user:write',
    'user:delete',
    'dashboard:read',
    'admin:access',
  ],
  [ROLES.USER]: [
    'dashboard:read',
    'profile:read',
    'profile:write',
  ],
} as const;

// 역할 체크 함수
export const hasRole = (userRole: Role, requiredRole: Role): boolean => {
  const roleHierarchy = {
    [ROLES.ADMIN]: 2,
    [ROLES.USER]: 1,
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// 권한 체크 함수
export const hasPermission = (userRole: Role, permission: string): boolean => {
  return PERMISSIONS[userRole]?.includes(permission as any) || false;
};

// 역할별 라우트 접근 권한
export const ROLE_ROUTES = {
  [ROLES.ADMIN]: [
    '/admin/dashboard',
    '/admin/users',
    '/dashboard',
    '/profile',
  ] as const,
  [ROLES.USER]: [
    '/dashboard',
    '/profile',
  ] as const,
} as const;

// 라우트 접근 권한 체크
export const canAccessRoute = (userRole: Role, route: string): boolean => {
  return ROLE_ROUTES[userRole]?.includes(route as any) || false;
};
