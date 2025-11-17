import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useFrontAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary[50]} 0%, ${props => props.theme.colors.accent[50]} 100%);
  padding: ${props => props.theme.spacing.lg};
`;

const LoginCard = styled.div`
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius['3xl']};
  box-shadow: ${props => props.theme.shadows.lg};
  padding: ${props => props.theme.spacing['3xl']};
  width: 100%;
  max-width: 28rem;
  border: 1px solid ${props => props.theme.colors.gray[100]};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSize['3xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.gray[800]};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.gray[700]};
`;

const Input = styled.input<{ $hasError: boolean }>`
  width: 100%;
  padding: ${props => `${props.theme.spacing.md} ${props.theme.spacing.lg}`};
  border: 2px solid ${props => props.$hasError ? props.theme.colors.error[300] : props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  background-color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSize.base};
  font-family: inherit;
  font-weight: ${props => props.theme.fontWeight.medium};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  height: 3.5rem;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? props.theme.colors.error[500] : props.theme.colors.toss.blue};
    box-shadow: 0 0 0 4px ${props => props.$hasError ? `${props.theme.colors.error[500]}20` : `${props.theme.colors.toss.blue}20`};
  }

  &:hover:not(:disabled) {
    border-color: ${props => props.$hasError ? props.theme.colors.error[400] : props.theme.colors.gray[300]};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
    font-weight: ${props => props.theme.fontWeight.normal};
  }
`;

const Button = styled.button<{ $disabled: boolean; $loading: boolean }>`
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.fontWeight.semibold};
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 2px solid transparent;
  width: 100%;
  padding: ${props => `${props.theme.spacing.md} ${props.theme.spacing.lg}`};
  height: 3.5rem;
  font-size: ${props => props.theme.fontSize.base};
  background-color: ${props => props.theme.colors.toss.blue};
  color: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadows.button};

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.primary[700]};
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: ${props => props.theme.shadows.button};
  }

  ${props => (props.$disabled || props.$loading) && `
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  `}

  ${props => props.$loading && `
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 1rem;
      height: 1rem;
      border: 2px solid ${props.theme.colors.white};
      border-top: 2px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `}
`;

const ErrorAlert = styled.div`
  background-color: ${props => props.theme.colors.red[50]};
  border: 1px solid ${props => props.theme.colors.red[200]};
  color: ${props => props.theme.colors.red[600]};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.gray[600]};
  font-size: ${props => props.theme.fontSize.sm};
`;

const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.toss.blue};
  font-weight: ${props => props.theme.fontWeight.semibold};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const FrontLoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useFrontAuthStore();
  const navigate = useNavigate();

  // 로그인 성공 시 리다이렉트
  useEffect(() => {
    if (isAuthenticated && !loading) {
      // persist가 localStorage에 저장되고 상태가 안정화될 때까지 대기
      const timer = setTimeout(() => {
        const stored = localStorage.getItem('front-auth-storage');
        if (stored) {
          try {
            const authData = JSON.parse(stored);
            if (authData.state?.token && authData.state?.user) {
              navigate('/dashboard', { replace: true });
            }
          } catch (e) {
            // 파싱 실패 시에도 리다이렉트 시도
            navigate('/dashboard', { replace: true });
          }
        } else {
          // localStorage에 없어도 인증 상태가 true이면 리다이렉트
          navigate('/dashboard', { replace: true });
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      // persist가 localStorage에 저장될 시간을 주기 위해 약간의 지연
      // 로그인 성공 후 즉시 리다이렉트하지 않고 상태가 안정화될 때까지 대기
      await new Promise(resolve => setTimeout(resolve, 500));
      // 로그인 성공 시 리다이렉트는 useEffect에서 처리
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>로그인</Title>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorAlert>{error}</ErrorAlert>}
          
          <FormField>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              $hasError={!!error}
              required
            />
          </FormField>

          <FormField>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              $hasError={!!error}
              required
            />
          </FormField>

          <Button
            type="submit"
            $disabled={loading}
            $loading={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </Form>

        <LinkText>
          계정이 없으신가요? <StyledLink to="/register">회원가입</StyledLink>
        </LinkText>
      </LoginCard>
    </LoginContainer>
  );
};

export default FrontLoginForm;
