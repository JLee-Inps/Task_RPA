/**
 * Front 영역 전용 인증 타입 정의
 */

// 사용자 전용 사용자 정보
export interface FrontUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'premium_user';
  profile: FrontUserProfile;
  preferences: FrontUserPreferences;
  avatar?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
  isVerified: boolean;
}

// 사용자 프로필 정보
export interface FrontUserProfile {
  nickname?: string;
  phone?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  address?: FrontAddress;
  bio?: string;
  socialLinks?: FrontSocialLinks;
}

// 사용자 주소 정보
export interface FrontAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// 사용자 소셜 링크
export interface FrontSocialLinks {
  website?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

// 사용자 설정
export interface FrontUserPreferences {
  language: string;
  timezone: string;
  notifications: FrontNotificationSettings;
  privacy: FrontPrivacySettings;
  theme: 'light' | 'dark' | 'auto';
}

// 알림 설정
export interface FrontNotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
  updates: boolean;
}

// 프라이버시 설정
export interface FrontPrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  showBirthDate: boolean;
}

// 사용자 로그인 요청
export interface FrontLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 사용자 회원가입 요청
export interface FrontRegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

// 사용자 인증 응답
export interface FrontAuthResponse {
  user: FrontUser;
  token: string;
  expiresIn: number;
}

// 사용자 인증 상태
export interface FrontAuthState {
  user: FrontUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  preferences: FrontUserPreferences | null;
}