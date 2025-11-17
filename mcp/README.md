# Task RPA MCP Server

Cursor와 연동하여 작업 자동화를 수행하는 MCP (Model Context Protocol) 서버입니다.

## 기능

- 📝 **마크다운 파일 생성**: 작업 내용을 마크다운 파일로 생성
- ✅ **업무 자동 추가**: 생성된 파일을 읽어서 업무 목록에 자동 추가
- 🔗 **백엔드 연동**: 백엔드 API를 통해 업무 관리

## 설치

```bash
npm install
```

## 빌드

```bash
npm run build
```

## 실행

```bash
npm start
```

또는 개발 모드:

```bash
npm run dev
```

## 환경 변수

`.env` 파일 생성:

```env
API_URL=http://localhost:3001
JWT_TOKEN=your-jwt-token
```

## Cursor 설정

Cursor 설정 파일에 MCP 서버를 추가하세요. 자세한 내용은 [MCP 설정 가이드](../docs/MCP_SETUP.md)를 참고하세요.

## 사용 예제

Cursor에서:

```
작업 내용을 정리해서 md 파일로 만들어줘
```

MCP 서버가 자동으로:
1. 마크다운 파일 생성
2. 백엔드 API 호출하여 업무 목록에 추가

