import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
  }

  body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${props => props.theme.colors.gray[50]};
    color: ${props => props.theme.colors.gray[800]};
    line-height: 1.6;
    font-size: ${props => props.theme.fontSize.base};
    font-weight: ${props => props.theme.fontWeight.normal};
  }

  #root {
    min-height: 100vh;
  }

  /* 스크롤바 스타일링 */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.gray[100]};
    border-radius: ${props => props.theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.gray[300]};
    border-radius: ${props => props.theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.gray[400]};
  }

  /* 포커스 스타일 */
  *:focus {
    outline: 2px solid ${props => props.theme.colors.toss.blue};
    outline-offset: 2px;
  }

  /* 선택 텍스트 스타일 */
  ::selection {
    background-color: ${props => props.theme.colors.toss.blue}20;
    color: ${props => props.theme.colors.gray[900]};
  }

  /* 링크 스타일 */
  a {
    color: ${props => props.theme.colors.toss.blue};
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: ${props => props.theme.colors.primary[700]};
  }

  /* 버튼 기본 스타일 리셋 */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    margin: 0;
  }

  /* 입력 필드 기본 스타일 */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    border: none;
    outline: none;
    background: transparent;
  }

  /* 리스트 스타일 리셋 */
  ul, ol {
    list-style: none;
  }

  /* 테이블 스타일 리셋 */
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  /* 이미지 스타일 */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* 코드 스타일 */
  code {
    font-family: 'Fira Code', 'Monaco', 'Consolas', 'Courier New', monospace;
    background-color: ${props => props.theme.colors.gray[100]};
    padding: 0.125rem 0.25rem;
    border-radius: ${props => props.theme.borderRadius.sm};
    font-size: 0.875em;
  }

  pre {
    font-family: 'Fira Code', 'Monaco', 'Consolas', 'Courier New', monospace;
    background-color: ${props => props.theme.colors.gray[100]};
    padding: ${props => props.theme.spacing.md};
    border-radius: ${props => props.theme.borderRadius.md};
    overflow-x: auto;
  }

  /* 접근성 개선 */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
