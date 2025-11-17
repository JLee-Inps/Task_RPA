# Task RPA - ChatGPT 기반 업무 자동화 툴

Git 커밋을 자동화하고 GPT를 활용하여 업무를 관리하는 RPA 도구입니다.

## 주요 기능

- 🚀 **Git 자동화**: 커밋 메시지만 입력하면 자동으로 commit + push 실행
- 🤖 **GPT 요약**: Git 커밋 내용을 GPT API로 자동 요약하여 업무 목록에 추가
- 📅 **업무 일정 관리**: 캘린더 형식으로 업무 일정 확인 및 관리
- 📊 **진행 현황 차트**: 업무 진행 현황을 시각적으로 확인
- 🎨 **토스 스타일 UI**: 깔끔하고 모던한 사용자 인터페이스

## 기술 스택

### Frontend
- React + TypeScript
- Styled Components
- Chart.js (차트 시각화)
- React Router

### Backend
- Fastify + TypeScript
- MySQL
- OpenAI API
- Simple Git

### Infrastructure
- Docker & Docker Compose

## 시작하기

### 1. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열어서 다음 값들을 설정하세요:
- `OPENAI_API_KEY`: OpenAI API 키
- `JWT_SECRET`: JWT 시크릿 키 (프로덕션에서는 강력한 키 사용)
- `GITHUB_TOKEN`: GitHub 토큰 (선택사항)

### 2. Docker로 실행

```bash
docker-compose up -d
```

이 명령어는 다음 서비스들을 시작합니다:
- MySQL (포트 3306)
- Backend API (포트 3001)
- Frontend (포트 3000)

### 3. 접속

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 프로젝트 구조

```
Task_RPA/
├── back/                 # Backend (Fastify)
│   ├── src/
│   │   ├── routes/      # API 라우트
│   │   ├── services/    # 비즈니스 로직
│   │   └── db/          # 데이터베이스 설정
│   └── Dockerfile
├── front/               # Frontend (React)
│   ├── src/
│   │   ├── front/       # 사용자 페이지
│   │   └── core/        # 공통 모듈
│   └── Dockerfile
├── mcp/                  # MCP Server (Cursor 연동)
│   ├── src/
│   │   └── index.ts     # MCP 서버 메인
│   └── package.json
└── docker-compose.yml
```

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 업무 관리
- `GET /api/tasks/list` - 업무 목록 조회
- `GET /api/tasks/:id` - 업무 상세 조회
- `POST /api/tasks/create` - 업무 생성
- `PUT /api/tasks/:id` - 업무 수정
- `DELETE /api/tasks/:id` - 업무 삭제

### Git 자동화
- `GET /api/git/commits` - 커밋 목록 조회

### 차트
- `GET /api/charts/stats` - 통계 데이터
- `GET /api/charts/progress` - 진행 현황 데이터

## 사용 방법

### 1. MCP를 통한 작업 자동화

#### Step 1: MCP 서버 설정

자세한 설정 방법은 [MCP 설정 가이드](./docs/MCP_SETUP.md)를 참고하세요.

#### Step 2: Cursor에서 사용

Cursor의 채팅에서 다음과 같이 명령을 입력하세요:

```
작업 내용을 정리해서 md 파일로 만들어줘
```

또는:

```
오늘 작업한 내용을 정리해서 work-summary.md 파일로 만들어줘
```

MCP 서버가 자동으로:
1. 마크다운 파일 생성
2. 파일 내용을 읽어서 업무 목록에 추가

### 2. Git 커밋

Cursor의 터미널에서:

```bash
npm run git-commit "커밋 메시지"
```

### 2. 업무 관리

- **업무 목록**: 모든 업무를 카드 형식으로 확인
- **업무 일정**: 캘린더로 일정 확인
- **진행 현황**: 차트로 통계 확인

## 개발

### Backend 개발

```bash
cd back
npm install
npm run dev
```

### Frontend 개발

```bash
cd front
npm install
npm start
```

### MCP 서버 개발

```bash
cd mcp
npm install
npm run build
npm start
```

## 환경 변수

자세한 환경 변수 목록은 `.env.example` 파일을 참고하세요.

## 라이선스

ISC

