/**
 * 라우트 상수 정의
 */

// 공개 라우트
export const PUBLIC_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

// 보호된 라우트 - 일반 사용자
export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  TASK_LIST: '/tasks',
  TASK_SCHEDULE: '/tasks/schedule',
  TASK_CHART: '/tasks/chart',
  GIT_TRIGGER: '/git/trigger',
} as const;

// 프론트 라우트 (PROTECTED_ROUTES와 동일, 호환성을 위해 유지)
export const FRONT_ROUTES = PROTECTED_ROUTES;

// 보호된 라우트 - 관리자
export const ADMIN_ROUTES = {
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
} as const;

// 공통 라우트
export const COMMON_ROUTES = {
  HOME: '/',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/404',
} as const;

// 모든 라우트
export const ALL_ROUTES = {
  ...PUBLIC_ROUTES,
  ...PROTECTED_ROUTES,
  ...ADMIN_ROUTES,
  ...COMMON_ROUTES,
} as const;

// 라우트 타입
export type PublicRoute = typeof PUBLIC_ROUTES[keyof typeof PUBLIC_ROUTES];
export type ProtectedRoute = typeof PROTECTED_ROUTES[keyof typeof PROTECTED_ROUTES];
export type AdminRoute = typeof ADMIN_ROUTES[keyof typeof ADMIN_ROUTES];
export type CommonRoute = typeof COMMON_ROUTES[keyof typeof COMMON_ROUTES];
export type AllRoute = typeof ALL_ROUTES[keyof typeof ALL_ROUTES];
