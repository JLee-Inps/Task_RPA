#!/usr/bin/env node

/**
 * 암호화된 프로덕션 빌드 스크립트
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔒 암호화된 프로덕션 빌드 시작...');

try {
  // 환경 변수 설정
  process.env.REACT_APP_ENV = 'production';
  process.env.NODE_ENV = 'production';
  
  // 프로덕션 환경 파일 복사
  if (fs.existsSync('env.production')) {
    fs.copyFileSync('env.production', '.env');
    console.log('✅ 프로덕션 환경 설정 파일 복사 완료');
  }
  
  // 1단계: React 앱 빌드
  console.log('📦 React 앱 빌드 중...');
  execSync('react-scripts build', { stdio: 'inherit' });
  
  // 빌드 결과 확인
  if (!fs.existsSync('build')) {
    throw new Error('빌드 실패: build 폴더가 생성되지 않았습니다.');
  }
  
  // 2단계: JavaScript 난독화 도구 설치 확인
  console.log('🔧 JavaScript 난독화 도구 확인 중...');
  try {
    execSync('npx javascript-obfuscator --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('📦 JavaScript 난독화 도구 설치 중...');
    execSync('npm install -g javascript-obfuscator', { stdio: 'inherit' });
  }
  
  // 3단계: 코드 난독화 실행
  console.log('🔒 JavaScript 코드 난독화 중...');
  execSync('npx javascript-obfuscator build --output build-obfuscated --config obfuscator.config.js', { stdio: 'inherit' });
  
  // 4단계: 정적 파일 복사
  console.log('📁 정적 파일 복사 중...');
  const staticFiles = ['manifest.json', 'robots.txt'];
  const staticDirs = ['static'];
  
  staticFiles.forEach(file => {
    const srcPath = path.join('build', file);
    const destPath = path.join('build-obfuscated', file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  });
  
  staticDirs.forEach(dir => {
    const srcPath = path.join('build', dir);
    const destPath = path.join('build-obfuscated', dir);
    if (fs.existsSync(srcPath)) {
      execSync(`cp -r "${srcPath}" "${destPath}"`, { stdio: 'inherit' });
    }
  });
  
  // 5단계: CSS 파일 복사 (난독화하지 않음)
  console.log('🎨 CSS 파일 복사 중...');
  const cssFiles = fs.readdirSync('build').filter(file => file.endsWith('.css'));
  cssFiles.forEach(file => {
    const srcPath = path.join('build', file);
    const destPath = path.join('build-obfuscated', file);
    fs.copyFileSync(srcPath, destPath);
  });
  
  // 6단계: 빌드 결과 확인
  if (fs.existsSync('build-obfuscated')) {
    console.log('✅ 암호화된 프로덕션 빌드 완료!');
    console.log('📁 암호화된 빌드 파일 위치: ./build-obfuscated');
    console.log('🔒 모든 JavaScript 코드가 난독화되었습니다.');
    console.log('⚠️  주의: 이 빌드는 디버깅이 어려우므로 개발 시에는 사용하지 마세요.');
  } else {
    throw new Error('암호화 빌드 실패: build-obfuscated 폴더가 생성되지 않았습니다.');
  }
  
} catch (error) {
  console.error('❌ 암호화된 프로덕션 빌드 실패:', error.message);
  process.exit(1);
}
