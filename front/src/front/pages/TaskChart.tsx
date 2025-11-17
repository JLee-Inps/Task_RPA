import React from 'react';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';

const Container = styled.div`
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.lg};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary[50]} 0%, ${props => props.theme.colors.accent[50]} 100%);
  min-height: calc(100vh - 4rem);
`;

const PageHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSize['4xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Subtitle = styled.p`
  font-size: ${props => props.theme.fontSize.base};
  color: ${props => props.theme.colors.gray[600]};
`;

const TaskChartPage: React.FC = () => {
  return (
    <Layout>
      <Container>
        <PageHeader>
          <Title>업무 차트</Title>
          <Subtitle>업무 진행 현황을 차트로 확인하세요</Subtitle>
        </PageHeader>
        <p>업무 차트 페이지는 준비 중입니다.</p>
      </Container>
    </Layout>
  );
};

export default TaskChartPage;
