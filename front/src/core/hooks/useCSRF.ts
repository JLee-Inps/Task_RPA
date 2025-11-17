/**
 * CSRF 토큰 관리 훅
 */

import { useEffect, useState } from 'react';
import csrfService from '../services/csrfService';

export const useCSRF = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * CSRF 토큰을 초기화합니다
   */
  const initializeCSRFToken = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await csrfService.getCSRFToken();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'CSRF 토큰 초기화 실패';
      setError(errorMessage);
      console.error('CSRF 토큰 초기화 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * CSRF 토큰을 새로고침합니다
   */
  const refreshCSRFToken = async () => {
    csrfService.clearToken();
    await initializeCSRFToken();
  };

  /**
   * 현재 CSRF 토큰을 가져옵니다
   */
  const getCurrentToken = () => {
    return csrfService.getCurrentToken();
  };

  /**
   * CSRF 토큰이 유효한지 확인합니다
   */
  const isTokenValid = () => {
    return csrfService.isTokenValid();
  };

  // 컴포넌트 마운트 시 CSRF 토큰 초기화
  useEffect(() => {
    initializeCSRFToken();
  }, []);

  return {
    isLoading,
    error,
    initializeCSRFToken,
    refreshCSRFToken,
    getCurrentToken,
    isTokenValid,
  };
};
