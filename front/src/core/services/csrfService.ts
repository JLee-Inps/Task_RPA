/**
 * CSRF 토큰 관리 서비스
 */

import env from '../config/env';

interface CSRFResponse {
  csrfToken: string;
  expiresIn: number;
}

class CSRFService {
  private token: string | null = null;
  private tokenExpiry: number = 0;

  /**
   * CSRF 토큰을 가져옵니다
   */
  async getCSRFToken(): Promise<string> {
    // 토큰이 유효한 경우 기존 토큰 반환
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const response = await fetch(env.REACT_APP_CSRF_TOKEN_URL, {
        method: 'GET',
        credentials: 'include', // 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`CSRF 토큰 요청 실패: ${response.status}`);
      }

      const data: CSRFResponse = await response.json();
      
      this.token = data.csrfToken;
      this.tokenExpiry = Date.now() + (data.expiresIn * 1000); // 밀리초로 변환
      
      return this.token;
    } catch (error) {
      console.error('CSRF 토큰 가져오기 실패:', error);
      throw new Error('CSRF 토큰을 가져올 수 없습니다.');
    }
  }

  /**
   * 현재 저장된 CSRF 토큰을 반환합니다
   */
  getCurrentToken(): string | null {
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }
    return null;
  }

  /**
   * CSRF 토큰을 무효화합니다
   */
  clearToken(): void {
    this.token = null;
    this.tokenExpiry = 0;
  }

  /**
   * 쿠키에서 CSRF 토큰을 읽어옵니다
   */
  getTokenFromCookie(): string | null {
    const cookies = document.cookie.split(';');
    const csrfCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${env.REACT_APP_CSRF_COOKIE_NAME}=`)
    );
    
    if (csrfCookie) {
      return csrfCookie.split('=')[1];
    }
    
    return null;
  }

  /**
   * CSRF 토큰이 유효한지 확인합니다
   */
  isTokenValid(): boolean {
    return !!(this.token && Date.now() < this.tokenExpiry);
  }
}

// 싱글톤 인스턴스 생성
const csrfService = new CSRFService();

export default csrfService;
