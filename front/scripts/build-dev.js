#!/usr/bin/env node

/**
 * 개발 환경 빌드 스크립트
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 개발 환경 빌드 시작...');

try {
  // 환경 변수 설정
  process.env.REACT_APP_ENV = 'local';
  process.env.NODE_ENV = 'development';
  
  // 로컬 환경 파일 복사
  if (fs.existsSync('env.local')) {
    fs.copyFileSync('env.local', '.env');
    console.log('✅ 로컬 환경 설정 파일 복사 완료');
  }
  
  // 빌드 실행
  console.log('📦 React 앱 빌드 중...');
  execSync('react-scripts build', { stdio: 'inherit' });
  
  // 빌드 결과 확인
  if (fs.existsSync('build')) {
    console.log('✅ 개발 환경 빌드 완료!');
    console.log('📁 빌드 파일 위치: ./build');
  } else {
    throw new Error('빌드 실패: build 폴더가 생성되지 않았습니다.');
  }
  
} catch (error) {
  console.error('❌ 개발 환경 빌드 실패:', error.message);
  process.exit(1);
}
