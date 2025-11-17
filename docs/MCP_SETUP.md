# MCP 서버 설정 가이드

이 문서는 Cursor에서 MCP 서버를 설정하여 작업 자동화를 사용하는 방법을 설명합니다.

## MCP란?

Model Context Protocol (MCP)은 AI 도구와 외부 시스템을 연결하는 프로토콜입니다. Cursor에서 MCP 서버를 통해 파일 생성, 업무 관리 등의 작업을 자동화할 수 있습니다.

## 설치 및 설정

### 1. MCP 서버 의존성 설치

```bash
cd mcp
npm install
```

### 2. 환경 변수 설정

`mcp/.env` 파일 생성:

```env
API_URL=http://localhost:3001
JWT_TOKEN=your-jwt-token
```

**JWT_TOKEN 얻는 방법:**
1. 프론트엔드에서 로그인
2. 브라우저 개발자 도구 → Application → Local Storage에서 토큰 확인
3. 또는 백엔드 API `/api/auth/login`으로 로그인 후 토큰 받기

### 3. Cursor 설정

Cursor 설정 파일에 MCP 서버를 추가합니다.

**macOS/Linux**: `~/.cursor/mcp.json` 또는 Cursor 설정에서 추가
**Windows**: `%APPDATA%\Cursor\mcp.json`

```json
{
  "mcpServers": {
    "task-rpa": {
      "command": "node",
      "args": [
        "/Users/jelee/Desktop/dev/Task_RPA/mcp/dist/index.js"
      ],
      "env": {
        "API_URL": "http://localhost:3001",
        "JWT_TOKEN": "your-jwt-token"
      }
    }
  }
}
```

또는 개발 모드로 실행:

```json
{
  "mcpServers": {
    "task-rpa": {
      "command": "npm",
      "args": [
        "run",
        "dev"
      ],
      "cwd": "/Users/jelee/Desktop/dev/Task_RPA/mcp",
      "env": {
        "API_URL": "http://localhost:3001",
        "JWT_TOKEN": "your-jwt-token"
      }
    }
  }
}
```

### 4. MCP 서버 빌드

```bash
cd mcp
npm run build
```

## 사용 방법

### Cursor에서 사용

Cursor의 채팅에서 다음과 같이 명령을 입력하세요:

```
작업 내용을 정리해서 md 파일로 만들어줘
```

또는 더 구체적으로:

```
오늘 작업한 내용을 정리해서 work-summary.md 파일로 만들어줘
```

MCP 서버가 자동으로:
1. 마크다운 파일 생성
2. 파일 내용을 읽어서 업무 목록에 추가

### 사용 가능한 도구

#### 1. `create_markdown_file`

마크다운 파일을 생성하고 업무 목록에 자동 추가합니다.

**파라미터:**
- `filename`: 파일명 (예: "work-summary.md")
- `content`: 마크다운 내용
- `title`: 업무 제목 (선택사항, 파일명 기본값)
- `description`: 업무 설명 (선택사항, 파일 내용 기본값)

#### 2. `create_task_from_file`

기존 파일을 읽어서 업무 목록에 추가합니다.

**파라미터:**
- `filepath`: 파일 경로
- `title`: 업무 제목 (선택사항)

## 예제

### 예제 1: 작업 요약 파일 생성

Cursor에서:
```
오늘 작업한 내용을 정리해서 today-work.md 파일로 만들어줘
```

결과:
- `today-work.md` 파일 생성
- 업무 목록에 "today-work" 제목으로 추가

### 예제 2: 기존 파일로 업무 생성

Cursor에서:
```
summary.md 파일을 읽어서 업무로 추가해줘
```

결과:
- `summary.md` 파일 내용 읽기
- 업무 목록에 추가

## 문제 해결

### MCP 서버가 작동하지 않는 경우

1. **서버 빌드 확인**
   ```bash
   cd mcp
   npm run build
   ```

2. **환경 변수 확인**
   - `API_URL`이 올바른지 확인
   - `JWT_TOKEN`이 유효한지 확인

3. **백엔드 실행 확인**
   ```bash
   curl http://localhost:3001/health
   ```

4. **Cursor 재시작**
   - Cursor를 완전히 종료 후 재시작

### 인증 오류

JWT 토큰이 만료되었거나 유효하지 않은 경우:
1. 프론트엔드에서 다시 로그인
2. 새로운 토큰을 `.env` 파일에 업데이트
3. Cursor 재시작

## 개발 모드

개발 중에는 `tsx`를 사용하여 실시간으로 변경사항을 반영할 수 있습니다:

```json
{
  "mcpServers": {
    "task-rpa": {
      "command": "npx",
      "args": ["tsx", "src/index.ts"],
      "cwd": "/Users/jelee/Desktop/dev/Task_RPA/mcp"
    }
  }
}
```

## 아키텍처

```
[Cursor] → [MCP Server] → [Backend API] → [Database]
                              ↓
                         [업무 목록 추가]
```

1. Cursor에서 명령 입력
2. MCP 서버가 파일 생성
3. MCP 서버가 백엔드 API 호출
4. 백엔드가 업무 목록에 추가

