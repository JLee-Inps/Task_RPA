import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAdminAuthStore } from '../store/authStore';

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

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ 
  children, 
  redirectIfAuthenticated = false 
}) => {
  const { admin, isAuthenticated, isLoading } = useAdminAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingText>관리자 인증 확인 중...</LoadingText>
      </LoadingContainer>
    );
  }

  if (redirectIfAuthenticated && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (!redirectIfAuthenticated && !isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
