import React from 'react';
import styled from 'styled-components';
import { useAdminAuthStore } from '../auth/store/authStore';
import Layout from '../components/layout/Layout';

const Container = styled.div`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.md};
`;

const Header = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSize['3xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.gray[900]};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  margin-top: ${props => props.theme.spacing.sm};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing['2xl']};

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;

const StatContent = styled.div`
  display: flex;
  align-items: center;
`;

const StatIcon = styled.div<{ $color: string }>`
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.$color};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-right: ${props => props.theme.spacing.md};
`;

const StatInfo = styled.div``;

const StatLabel = styled.p`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.gray[600]};
`;

const StatValue = styled.p`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.gray[900]};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing.lg};

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FeatureCard = styled.div`
  background-color: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;

const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const FeatureButton = styled.button<{ $variant: 'primary' | 'secondary' | 'success' | 'purple' }>`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeight.medium};
  transition: all 0.15s ease-in-out;
  cursor: pointer;

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background-color: ${props.theme.colors.primary[600]};
          color: ${props.theme.colors.white};
          &:hover {
            background-color: ${props.theme.colors.primary[700]};
          }
        `;
      case 'secondary':
        return `
          background-color: ${props.theme.colors.gray[600]};
          color: ${props.theme.colors.white};
          &:hover {
            background-color: ${props.theme.colors.gray[700]};
          }
        `;
      case 'success':
        return `
          background-color: ${props.theme.colors.green[600]};
          color: ${props.theme.colors.white};
          &:hover {
            background-color: ${props.theme.colors.green[700]};
          }
        `;
      case 'purple':
        return `
          background-color: ${props.theme.colors.purple[600]};
          color: ${props.theme.colors.white};
          &:hover {
            background-color: ${props.theme.colors.purple[700]};
          }
        `;
    }
  }}
`;

const AdminInfo = styled.div`
  margin-top: ${props => props.theme.spacing['2xl']};
  padding: ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.primary[50]};
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const AdminTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.primary[900]};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const AdminDetails = styled.div`
  color: ${props => props.theme.colors.primary[800]};
`;

const AdminItem = styled.p`
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const AdminLabel = styled.span`
  font-weight: ${props => props.theme.fontWeight.medium};
`;

const AdminDashboard: React.FC = () => {
  const { admin } = useAdminAuthStore();

  return (
    <Layout>
      <Container>
        <Header>
          <Title>관리자 대시보드</Title>
          <Subtitle>시스템 관리 및 모니터링</Subtitle>
        </Header>

        {/* 통계 카드들 */}
        <StatsGrid>
          <StatCard>
            <StatContent>
              <StatIcon $color="#dbeafe">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1.5rem', height: '1.5rem', color: '#0064ff' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </StatIcon>
              <StatInfo>
                <StatLabel>총 사용자</StatLabel>
                <StatValue>1,234</StatValue>
              </StatInfo>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatContent>
              <StatIcon $color="#dcfce7">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1.5rem', height: '1.5rem', color: '#00d4aa' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </StatIcon>
              <StatInfo>
                <StatLabel>활성 사용자</StatLabel>
                <StatValue>987</StatValue>
              </StatInfo>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatContent>
              <StatIcon $color="#fef3c7">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1.5rem', height: '1.5rem', color: '#ffcc00' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </StatIcon>
              <StatInfo>
                <StatLabel>오늘 가입</StatLabel>
                <StatValue>23</StatValue>
              </StatInfo>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatContent>
              <StatIcon $color="#fee2e2">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1.5rem', height: '1.5rem', color: '#ff3b30' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </StatIcon>
              <StatInfo>
                <StatLabel>시스템 상태</StatLabel>
                <StatValue>정상</StatValue>
              </StatInfo>
            </StatContent>
          </StatCard>
        </StatsGrid>

        {/* 관리 기능들 */}
        <FeaturesGrid>
          <FeatureCard>
            <FeatureTitle>사용자 관리</FeatureTitle>
            <FeatureDescription>
              사용자 계정을 생성, 수정, 삭제하고 권한을 관리하세요.
            </FeatureDescription>
            <FeatureButton $variant="primary">
              사용자 관리
            </FeatureButton>
          </FeatureCard>

          <FeatureCard>
            <FeatureTitle>시스템 설정</FeatureTitle>
            <FeatureDescription>
              애플리케이션 설정을 변경하고 시스템을 구성하세요.
            </FeatureDescription>
            <FeatureButton $variant="secondary">
              설정 관리
            </FeatureButton>
          </FeatureCard>

          <FeatureCard>
            <FeatureTitle>로그 관리</FeatureTitle>
            <FeatureDescription>
              시스템 로그를 확인하고 오류를 모니터링하세요.
            </FeatureDescription>
            <FeatureButton $variant="success">
              로그 보기
            </FeatureButton>
          </FeatureCard>

          <FeatureCard>
            <FeatureTitle>백업 관리</FeatureTitle>
            <FeatureDescription>
              데이터 백업을 생성하고 복원 작업을 수행하세요.
            </FeatureDescription>
            <FeatureButton $variant="purple">
              백업 관리
            </FeatureButton>
          </FeatureCard>
        </FeaturesGrid>

        {/* 관리자 정보 */}
        <AdminInfo>
          <AdminTitle>관리자 정보</AdminTitle>
          <AdminDetails>
            <AdminItem>
              <AdminLabel>현재 관리자:</AdminLabel> {admin?.name}
            </AdminItem>
            <AdminItem>
              <AdminLabel>이메일:</AdminLabel> {admin?.email}
            </AdminItem>
            <AdminItem>
              <AdminLabel>마지막 로그인:</AdminLabel> {new Date().toLocaleString('ko-KR')}
            </AdminItem>
          </AdminDetails>
        </AdminInfo>
      </Container>
    </Layout>
  );
};

export default AdminDashboard;