/**
 * Axios 인스턴스 설정
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import env from '../config/env';
import csrfService from '../services/csrfService';
import logger from '../services/logger';

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Front 인증 토큰 추가
    const frontToken = localStorage.getItem('front-auth-storage');
    if (frontToken) {
      try {
        const authData = JSON.parse(frontToken);
        if (authData.state?.token) {
          // 백엔드 JWT 인증은 기본적으로 Authorization: Bearer 토큰을 사용
          config.headers['Authorization'] = `Bearer ${authData.state.token}`;
          // 필요 시 추적용 커스텀 헤더도 함께 전달
          config.headers['X-User-Token'] = `Bearer ${authData.state.token}`;
        }
      } catch (error) {
        console.warn('Front 토큰 파싱 실패:', error);
      }
    }

    // Admin 인증 토큰 추가
    const adminToken = localStorage.getItem('admin-auth-storage');
    if (adminToken) {
      try {
        const authData = JSON.parse(adminToken);
        if (authData.state?.token) {
          config.headers['X-Admin-Token'] = `Bearer ${authData.state.token}`;
        }
      } catch (error) {
        console.warn('Admin 토큰 파싱 실패:', error);
      }
    }

    // CSRF 토큰 추가 (GET 요청이 아닌 경우)
    // CSRF 토큰 요청 실패 시에도 계속 진행 (선택적)
    if (config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
      try {
        const csrfToken = await csrfService.getCSRFToken();
        config.headers[env.REACT_APP_CSRF_HEADER_NAME] = csrfToken;
      } catch (error) {
        console.warn('CSRF 토큰 가져오기 실패 (계속 진행):', error);
        // CSRF 토큰이 없어도 요청은 계속 진행
      }
    }

    // 환경별 요청 로그
    logger.debug('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    logger.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 환경별 응답 로그
    logger.debug('API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
    });

    return response;
  },
  (error) => {
    logger.error('Response Error:', error);
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config?.baseURL + error.config?.url,
      data: error.response?.data,
    });

    // 401 Unauthorized 처리
    if (error.response?.status === 401) {
      logger.warn('인증 실패, 로그아웃 처리');
      localStorage.removeItem('front-auth-storage');
      localStorage.removeItem('admin-auth-storage');
      csrfService.clearToken();
      window.location.href = '/login';
    }

    // 403 Forbidden 처리 (CSRF 토큰 오류 등)
    if (error.response?.status === 403) {
      logger.warn('접근이 거부되었습니다. CSRF 토큰을 확인하세요.');
      csrfService.clearToken();
    }

    // 404 Not Found 처리
    if (error.response?.status === 404) {
      console.error('❌ 404 Not Found:', {
        요청_URL: error.config?.baseURL + error.config?.url,
        메서드: error.config?.method,
        백엔드_상태: '백엔드가 실행 중인지 확인하세요.',
      });
    }

    // CORS 에러 처리
    if (error.code === 'ERR_NETWORK') {
      logger.error('네트워크 오류가 발생했습니다.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
