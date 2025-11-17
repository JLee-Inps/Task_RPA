/**
 * JavaScript 코드 난독화 설정
 * 프로덕션 빌드에서 코드를 암호화하여 배포
 */

module.exports = {
  // 난독화 레벨 설정 (0-3, 3이 가장 강력)
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: true,
  debugProtectionInterval: 2000,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 5,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ['base64'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
  
  // 제외할 파일들 (React 관련 파일들은 제외)
  exclude: [
    '**/node_modules/**',
    '**/static/**',
    '**/*.map',
    '**/*.css',
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif',
    '**/*.svg',
    '**/*.ico',
    '**/manifest.json',
    '**/robots.txt'
  ],
  
  // 소스맵 생성 (디버깅용)
  sourceMap: false,
  
  // 압축 설정
  compact: true,
  
  // 변수명 변환 설정
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  
  // 문자열 배열 설정
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  
  // 제어 흐름 난독화
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  
  // 디버그 보호
  debugProtection: true,
  debugProtectionInterval: 2000,
  
  // 콘솔 출력 비활성화 (프로덕션)
  disableConsoleOutput: true,
  
  // 자체 방어
  selfDefending: true,
  
  // 문자열 분할
  splitStrings: true,
  splitStringsChunkLength: 5,
  
  // 객체 키 변환
  transformObjectKeys: true,
  
  // 숫자를 표현식으로 변환
  numbersToExpressions: true,
  
  // 데드 코드 주입
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  
  // 문자열 배열 래퍼
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: 'function',
  
  // 문자열 배열 회전 및 셔플
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayIndexShift: true,
  
  // 문자열 배열 호출 변환
  stringArrayCallsTransform: true,
  
  // 유니코드 이스케이프 시퀀스 비활성화
  unicodeEscapeSequence: false,
  
  // 로그 비활성화
  log: false,
  
  // 단순화
  simplify: true
};
