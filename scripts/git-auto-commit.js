#!/usr/bin/env node

/**
 * Git 자동 커밋 스크립트
 * Cursor에서 직접 실행하여 Git commit + push를 수행하고 백엔드에 전송
 * 
 * 사용법:
 *   node scripts/git-auto-commit.js "커밋 메시지"
 *   또는
 *   npm run git-commit "커밋 메시지"
 */

const { execSync } = require('child_process');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 환경 변수 로드
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const API_URL = process.env.REACT_APP_API_URL || process.env.API_URL || 'http://localhost:3001';
const JWT_TOKEN = process.env.JWT_TOKEN || '';

// 커밋 메시지 가져오기
const commitMessage = process.argv[2];

if (!commitMessage) {
  console.error('❌ 커밋 메시지를 입력해주세요.');
  console.log('사용법: node scripts/git-auto-commit.js "커밋 메시지"');
  process.exit(1);
}

// 브랜치 옵션
const branch = process.argv[3] || null;

async function runGitCommit() {
  try {
    console.log('🚀 Git 커밋 시작...');
    
    // 현재 브랜치 확인
    let currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    
    if (branch && branch !== currentBranch) {
      console.log(`📦 브랜치 전환: ${currentBranch} -> ${branch}`);
      try {
        execSync(`git checkout ${branch}`, { stdio: 'inherit' });
        currentBranch = branch;
      } catch (error) {
        console.log(`⚠️  브랜치가 없어 새로 생성합니다: ${branch}`);
        execSync(`git checkout -b ${branch}`, { stdio: 'inherit' });
        currentBranch = branch;
      }
    }

    // 변경사항 확인
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    if (!status.trim()) {
      console.log('⚠️  커밋할 변경사항이 없습니다.');
      return;
    }

    // Git add
    console.log('📝 변경사항 스테이징...');
    execSync('git add .', { stdio: 'inherit' });

    // Git commit
    console.log(`💾 커밋 생성: "${commitMessage}"`);
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

    // 커밋 정보 가져오기
    const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    const commitDate = execSync('git log -1 --format=%ci', { encoding: 'utf-8' }).trim();
    
    // 통계 정보 가져오기
    let filesChanged = '0';
    let insertions = '0';
    let deletions = '0';
    
    try {
      const diffStats = execSync('git diff --stat HEAD~1 HEAD', { encoding: 'utf-8' });
      const filesMatch = diffStats.match(/(\d+) files? changed/);
      const insertionsMatch = diffStats.match(/(\d+) insertions?/);
      const deletionsMatch = diffStats.match(/(\d+) deletions?/);
      
      filesChanged = filesMatch ? filesMatch[1] : '0';
      insertions = insertionsMatch ? insertionsMatch[1] : '0';
      deletions = deletionsMatch ? deletionsMatch[1] : '0';
    } catch (error) {
      // 첫 커밋이거나 통계를 가져올 수 없는 경우
      console.log('⚠️  통계 정보를 가져올 수 없습니다.');
    }

    const commitData = {
      hash: commitHash,
      branch: currentBranch,
      date: commitDate,
      stats: {
        filesChanged: parseInt(filesChanged),
        insertions: parseInt(insertions),
        deletions: parseInt(deletions),
      },
    };

    console.log('✅ 커밋이 완료되었습니다!');
    console.log('💡 원격 저장소에 push하면 Webhook을 통해 자동으로 업무 목록에 추가됩니다.');
    console.log(`   커밋 해시: ${commitHash}`);
    console.log(`   브랜치: ${currentBranch}`);

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}


runGitCommit();

