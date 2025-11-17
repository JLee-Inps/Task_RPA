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
  const [isChecking, setIsChecking] = useState(false);

  // localStorage에 토큰이 있지만 인증 상태가 false인 경우 상태 복원 (한 번만)
  useEffect(() => {
    if (!isAuthenticated && !isLoading && !isChecking) {
      const stored = localStorage.getItem('front-auth-storage');
      if (stored) {
        try {
          const authData = JSON.parse(stored);
          if (authData.state?.token && authData.state?.user) {
            // localStorage에 데이터가 있으면 checkAuth를 통해 상태 복원
            // checkAuth는 localStorage를 먼저 확인하므로 안전함
            setIsChecking(true);
            checkAuth()
              .then(() => {
                setIsChecking(false);
              })
              .catch(() => {
                setIsChecking(false);
              });
          }
        } catch (e) {
          // 파싱 실패 시 무시
          setIsChecking(false);
        }
      }
    }
  }, []); // 빈 배열로 마운트 시 한 번만 실행

  // 로딩 중이거나 확인 중일 때는 리다이렉트하지 않고 대기
  if (isLoading || isChecking) {
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
