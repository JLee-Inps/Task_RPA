import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAdminAuthStore } from '../store/authStore';

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

const AdminLoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: 'admin@toss.com',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAdminAuthStore();
  const navigate = useNavigate();

  // 로그인 성공 시 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      // 로그인 성공 시 리다이렉트는 useEffect에서 처리
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
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
        <Title>관리자 로그인</Title>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorAlert>{error}</ErrorAlert>}
          
          <FormField>
            <Label htmlFor="email">관리자 이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="관리자 이메일을 입력하세요"
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
            {loading ? '로그인 중...' : '관리자 로그인'}
          </Button>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default AdminLoginForm;
