/**
 * 국제화(i18n) 설정
 */

export const SUPPORTED_LANGUAGES = {
  KO: 'ko',
  EN: 'en',
} as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[keyof typeof SUPPORTED_LANGUAGES];

export const DEFAULT_LANGUAGE: SupportedLanguage = SUPPORTED_LANGUAGES.KO;

// 언어별 메시지
export const messages = {
  [SUPPORTED_LANGUAGES.KO]: {
    common: {
      login: '로그인',
      logout: '로그아웃',
      register: '회원가입',
      cancel: '취소',
      confirm: '확인',
      save: '저장',
      edit: '수정',
      delete: '삭제',
      loading: '로딩 중...',
      error: '오류가 발생했습니다',
      success: '성공했습니다',
    },
    auth: {
      loginTitle: '로그인',
      registerTitle: '회원가입',
      email: '이메일',
      password: '비밀번호',
      name: '이름',
      confirmPassword: '비밀번호 확인',
      loginSuccess: '로그인에 성공했습니다',
      registerSuccess: '회원가입에 성공했습니다',
      loginFailed: '로그인에 실패했습니다',
      registerFailed: '회원가입에 실패했습니다',
    },
  },
  [SUPPORTED_LANGUAGES.EN]: {
    common: {
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
    },
    auth: {
      loginTitle: 'Login',
      registerTitle: 'Register',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      confirmPassword: 'Confirm Password',
      loginSuccess: 'Login successful',
      registerSuccess: 'Registration successful',
      loginFailed: 'Login failed',
      registerFailed: 'Registration failed',
    },
  },
};

// 현재 언어 상태 관리
let currentLanguage: SupportedLanguage = DEFAULT_LANGUAGE;

export const setLanguage = (language: SupportedLanguage) => {
  currentLanguage = language;
  localStorage.setItem('language', language);
};

export const getLanguage = (): SupportedLanguage => {
  const stored = localStorage.getItem('language') as SupportedLanguage;
  return stored && Object.values(SUPPORTED_LANGUAGES).includes(stored) 
    ? stored 
    : DEFAULT_LANGUAGE;
};

export const getMessage = (key: string): string => {
  const keys = key.split('.');
  let message: any = messages[currentLanguage];
  
  for (const k of keys) {
    if (message && typeof message === 'object') {
      message = message[k];
    } else {
      return key; // 키를 찾을 수 없으면 키 자체를 반환
    }
  }
  
  return typeof message === 'string' ? message : key;
};

// 초기화
currentLanguage = getLanguage();
