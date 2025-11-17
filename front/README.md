# React 기본 보일러플레이트

이 프로젝트는 React, TypeScript, Styled Components, Axios, Zustand를 사용한 현대적인 웹 애플리케이션의 기본 보일러플레이트입니다.

## 🚀 주요 기능

- **이중 인증 시스템**: Front(사용자)와 Admin(관리자) 분리된 인증 시스템
- **JWT 토큰 기반 인증**: 자동 토큰 관리 및 갱신
- **라우팅**: React Router를 사용한 보호된 라우트 및 공개 라우트
- **상태 관리**: Zustand를 사용한 전역 상태 관리
- **API 통신**: Axios 인터셉터를 통한 자동 토큰 첨부 및 에러 처리
- **CSRF 보안**: CSRF 토큰을 통한 보안 강화
- **반응형 UI**: Styled Components를 사용한 모던한 UI
- **타입 안전성**: TypeScript로 타입 안전한 개발
- **테마 시스템**: 다크/라이트 모드 지원

## 📁 프로젝트 구조

```
src/
├── admin/               # 관리자 영역
│   ├── auth/            # 관리자 인증 관련
│   │   ├── components/  # AdminLoginForm, AdminProtectedRoute
│   │   ├── services/    # adminAuthService
│   │   ├── store/       # adminAuthStore
│   │   └── types/       # AdminUser, AdminAuthResponse 등
│   ├── components/      # 관리자 전용 컴포넌트
│   ├── pages/           # AdminDashboard, AdminUsers
│   └── ...
├── front/               # 사용자 영역
│   ├── auth/            # 사용자 인증 관련
│   │   ├── components/  # FrontLoginForm, FrontRegisterForm, FrontProtectedRoute
│   │   ├── services/    # frontAuthService
│   │   ├── store/       # frontAuthStore
│   │   └── types/       # FrontUser, FrontAuthResponse 등
│   ├── components/      # 사용자 전용 컴포넌트
│   ├── pages/           # UserDashboard, UserProfile
│   └── ...
├── core/                # 공통 핵심 기능
│   ├── config/          # 환경 설정
│   ├── constants/       # 상수 정의 (ROLES 등)
│   ├── error/           # 에러 페이지 (404, 401 등)
│   ├── http/            # Axios 설정 및 인터셉터
│   ├── i18n/            # 다국어 지원
│   ├── providers/       # Context Provider
│   ├── router/          # 라우터 설정
│   ├── theme/           # 테마 시스템
│   └── types/           # 공통 타입 정의
├── App.tsx
└── index.tsx
```

## 🛠 설치 및 실행

### 필수 요구사항
- Node.js 16.x 이상
- npm 또는 yarn

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
# 로컬 개발 서버 (자동으로 Mock 데이터 사용)
npm start

# 로컬 환경으로 빌드 후 서빙
npm run start:local

# 프로덕션 환경으로 빌드 후 서빙
npm run start:production
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

> **💡 팀 친화적 설계**: 환경 변수 설정 없이도 `npm start`만으로 로컬 개발 환경이 자동으로 설정됩니다.

### 빌드

#### 로컬 환경 빌드
```bash
npm run build:local
```

#### 프로덕션 환경 빌드
```bash
npm run build:production
```

#### 암호화된 프로덕션 빌드 (코드 난독화)
```bash
npm run build:obfuscated
```

> **주의**: 암호화된 빌드는 디버깅이 어려우므로 개발 시에는 사용하지 마세요.

## 🔧 환경 설정

### 환경별 설정

#### 🎯 **자동 환경 감지 시스템**
프로젝트는 환경 변수 설정 없이도 자동으로 환경을 감지합니다:

- **`npm start`**: 자동으로 로컬 환경으로 감지 (Mock 데이터 사용)
- **`npm run build`**: NODE_ENV가 production이면 프로덕션 환경으로 감지

#### 📁 **환경별 설정 파일 (선택사항)**
필요시 환경별 설정 파일을 사용할 수 있습니다:

##### 로컬 환경 (`env.local`)
```env
# 로컬 개발 환경 설정 (선택사항)
REACT_APP_ENV=local
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_USE_MOCK=true
REACT_APP_DEBUG=true
```

##### 프로덕션 환경 (`env.production`)
```env
# 프로덕션 환경 설정 (선택사항)
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_USE_MOCK=false
REACT_APP_DEBUG=false
```

> **💡 팀 개발 팁**: 환경 파일이 없어도 자동으로 적절한 기본값이 설정되므로, 팀원들은 별도 설정 없이 바로 개발을 시작할 수 있습니다.

### 환경 변수 설명
- `REACT_APP_ENV`: 환경 구분 (local/production)
- `REACT_APP_API_URL`: 백엔드 API 서버 URL
- `REACT_APP_CSRF_TOKEN_URL`: CSRF 토큰을 가져올 엔드포인트
- `REACT_APP_CSRF_HEADER_NAME`: CSRF 토큰을 전송할 헤더 이름
- `REACT_APP_CSRF_COOKIE_NAME`: CSRF 토큰 쿠키 이름
- `REACT_APP_DEBUG`: 디버그 모드 활성화
- `REACT_APP_LOG_LEVEL`: 로그 레벨 (debug/info/warn/error)
- `REACT_APP_USE_MOCK`: Mock 데이터 사용 여부
- `REACT_APP_ENABLE_ANALYTICS`: 분석 도구 활성화
- `REACT_APP_ENABLE_ERROR_REPORTING`: 에러 리포팅 활성화

## 📚 주요 기능 설명

### 1. 이중 인증 시스템
- **Front 인증**: 일반 사용자용 (user, premium_user 역할)
- **Admin 인증**: 관리자용 (admin, super_admin 역할)
- JWT 토큰 기반 인증
- 자동 토큰 갱신 및 관리
- 로그인 상태 유지 (Zustand persist)
- 권한별 라우트 접근 제어

### 2. API 서비스
- Axios 인터셉터를 통한 자동 토큰 첨부
- CSRF 토큰 자동 관리
- 자동 에러 처리 및 리다이렉트
- CORS 에러 처리
- 요청/응답 로깅

### 3. 라우팅 시스템
- **PublicRoute**: 인증 불필요한 페이지 (로그인, 회원가입)
- **FrontProtectedRoute**: 사용자 인증 필요한 페이지
- **AdminProtectedRoute**: 관리자 인증 필요한 페이지
- 자동 리다이렉트 및 권한 체크

### 4. 상태 관리
- Zustand를 사용한 전역 상태 관리
- 로컬 스토리지와 연동하여 상태 유지
- 타입 안전한 상태 관리
- Front/Admin 분리된 상태 관리

### 5. UI/UX 시스템
- Styled Components를 사용한 컴포넌트 스타일링
- 테마 시스템 (다크/라이트 모드)
- 반응형 디자인
- 로딩 상태 및 에러 처리

## 🔒 보안 기능
- JWT 토큰 자동 관리
- CSRF 토큰을 통한 CSRF 공격 방지
- XSS 방지를 위한 입력 검증
- CORS 정책 적용
- 권한 기반 접근 제어
- 이중 인증 시스템으로 권한 분리

## 🚀 로그인 정보

### Front (사용자) 로그인
- **URL**: `http://localhost:3000/login`
- **이메일**: `user@toss.com`
- **비밀번호**: `user123`
- **역할**: user, premium_user

### Admin (관리자) 로그인
- **URL**: `http://localhost:3000/admin/login`
- **이메일**: `admin@toss.com`
- **비밀번호**: `admin123`
- **역할**: admin, super_admin

## 📝 사용 예시

### Front 로그인 사용
```tsx
import { useFrontAuthStore } from '../front/auth/store/authStore';

const FrontLoginComponent = () => {
  const { login, isLoading } = useFrontAuthStore();
  
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };
  
  return (
    // 로그인 폼 JSX
  );
};
```

### Admin 로그인 사용
```tsx
import { useAdminAuthStore } from '../admin/auth/store/authStore';

const AdminLoginComponent = () => {
  const { login, isLoading } = useAdminAuthStore();
  
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error) {
      console.error('관리자 로그인 실패:', error);
    }
  };
  
  return (
    // 관리자 로그인 폼 JSX
  );
};
```

### API 호출 예시 (CSRF 토큰 자동 포함)
```tsx
import apiClient from '../core/http/axios';

const fetchUserData = async () => {
  try {
    const response = await apiClient.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('사용자 데이터 조회 실패:', error);
  }
};
```

### 보호된 라우트 사용
```tsx
import FrontProtectedRoute from '../front/auth/components/FrontProtectedRoute';
import AdminProtectedRoute from '../admin/auth/components/AdminProtectedRoute';

// 사용자 전용 페이지
const UserPage = () => (
  <FrontProtectedRoute>
    <UserDashboard />
  </FrontProtectedRoute>
);

// 관리자 전용 페이지
const AdminPage = () => (
  <AdminProtectedRoute>
    <AdminDashboard />
  </AdminProtectedRoute>
);
```

## 📋 변경 이력

### v1.2.0 (2024-01-XX)
- **환경별 빌드 시스템 구축**
  - 개발/프로덕션 환경 분리
  - 환경별 설정 파일 관리 (`env.development`, `env.production`)
  - 환경별 빌드 스크립트 추가
- **코드 암호화/난독화 기능 추가**
  - JavaScript 코드 난독화 설정
  - 암호화된 프로덕션 빌드 지원
  - 보안 강화된 배포 옵션
- **로깅 시스템 개선**
  - 환경별 로그 레벨 관리
  - 구조화된 로깅 서비스
  - 프로덕션 에러 리포팅 지원
- **환경 유틸리티 추가**
  - 환경별 기능 제어
  - Mock 데이터 사용 제어
  - 분석 도구 활성화 제어

### v1.1.0 (2024-01-XX)
- 이중 인증 시스템 구현 (Front/Admin 분리)
- CSRF 보안 기능 추가
- Styled Components로 UI 시스템 변경
- Protected Route 컴포넌트 개선
- README 문서 업데이트

### v1.0.0 (2024-01-XX)
- 초기 프로젝트 설정
- 기본 인증 시스템 구현
- 라우팅 시스템 구축

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해 주세요.

---

**Happy Coding! 🎉**