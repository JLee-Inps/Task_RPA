/**
 * 에러 바운더리 컴포넌트
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.gray[50]};
`;

const ErrorCard = styled.div`
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius['3xl']};
  box-shadow: ${props => props.theme.shadows.lg};
  padding: ${props => props.theme.spacing['3xl']};
  text-align: center;
  max-width: 28rem;
  width: 100%;
  border: 1px solid ${props => props.theme.colors.gray[100]};
`;

const ErrorIcon = styled.div`
  width: 6rem;
  height: 6rem;
  background-color: ${props => props.theme.colors.error[100]};
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto ${props => props.theme.spacing['2xl']};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSize['4xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Description = styled.p`
  font-size: ${props => props.theme.fontSize.lg};
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  line-height: 1.6;
`;

const ErrorDetails = styled.pre`
  background-color: ${props => props.theme.colors.gray[100]};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.gray[700]};
  text-align: left;
  overflow-x: auto;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const RetryButton = styled.button`
  background-color: ${props => props.theme.colors.toss.blue};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.fontSize.base};
  font-weight: ${props => props.theme.fontWeight.semibold};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primary[700]};
  }
`;

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorIcon>⚠️</ErrorIcon>
            <Title>문제가 발생했습니다</Title>
            <Description>
              예상치 못한 오류가 발생했습니다.<br />
              페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </Description>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <ErrorDetails>
                {this.state.error.toString()}
              </ErrorDetails>
            )}
            <RetryButton onClick={this.handleRetry}>
              다시 시도
            </RetryButton>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
