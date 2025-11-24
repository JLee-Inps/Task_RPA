import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useFrontAuthStore } from '../store/authStore';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.gray[50]};
  gap: ${props => props.theme.spacing.lg};
`;

const Spinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 4px solid ${props => props.theme.colors.gray[200]};
  border-top: 4px solid ${props => props.theme.colors.toss.blue};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.gray[600]};
`;

interface FrontProtectedRouteProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
}

const FrontProtectedRoute: React.FC<FrontProtectedRouteProps> = ({
  children,
  redirectIfAuthenticated = false
}) => {
  const { user, isAuthenticated, isLoading, checkAuth } = useFrontAuthStore();
  const location = useLocation();

  // localStorage에 토큰이 있지만 인증 상태가 false인 경우 상태 복원 (한 번만)
  // localStorage에 토큰이 있지만 인증 상태가 false인 경우 상태 복원 (한 번만)
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      const stored = localStorage.getItem('front-auth-storage');
      if (stored) {
        try {
          const authData = JSON.parse(stored);
          if (authData.state?.token && authData.state?.user) {
            // checkAuth 호출 제거 - AppRouter에서 처리하도록 위임하거나 store 초기화 시 처리됨
            // 여기서는 단순히 로딩 상태만 관리
          }
        } catch (e) {
          // 파싱 실패 시 무시
        }
      }
    }
  }, [isAuthenticated, isLoading]);

  // 로딩 중일 때는 리다이렉트하지 않고 대기
  if (isLoading) {
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingText>인증 확인 중...</LoadingText>
      </LoadingContainer>
    );
  }

  if (redirectIfAuthenticated && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!redirectIfAuthenticated && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default FrontProtectedRoute;
