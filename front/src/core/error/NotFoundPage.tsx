import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '../../front/components/ui/Button';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary[50]} 0%, ${props => props.theme.colors.accent[50]} 100%);
  padding: ${props => props.theme.spacing.lg};
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
  background-color: ${props => props.theme.colors.red[100]};
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

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const NotFoundPage: React.FC = () => {
  return (
    <Container>
      <ErrorCard>
        <ErrorIcon>🔍</ErrorIcon>
        <Title>404</Title>
        <Description>
          요청하신 페이지를 찾을 수 없습니다.<br />
          페이지가 이동되었거나 삭제되었을 수 있습니다.
        </Description>
        <ButtonContainer>
          <Link to="/">
            <Button fullWidth>
              홈으로 돌아가기
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" fullWidth>
              로그인 페이지
            </Button>
          </Link>
        </ButtonContainer>
      </ErrorCard>
    </Container>
  );
};

export default NotFoundPage;
