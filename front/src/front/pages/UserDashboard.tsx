import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFrontAuthStore } from '../auth/store/authStore';
import Layout from '../components/layout/Layout';
import taskService, { Task } from '../services/taskService';

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
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${props => props.theme.fontSize.base};
  color: ${props => props.theme.colors.gray[600]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.card};
  border: 1px solid ${props => props.theme.colors.gray[100]};
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fontSize['3xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.gray[600]};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.gray[800]};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const TaskGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TaskCard = styled.div<{ $status: string }>`
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.card};
  border: 2px solid ${props => {
    if (props.$status === 'completed') return props.theme.colors.green[200];
    if (props.$status === 'in_progress') return props.theme.colors.primary[200];
    if (props.$status === 'cancelled') return props.theme.colors.red[200];
    return props.theme.colors.gray[200];
  }};
  transition: all 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const TaskTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.gray[800]};
  margin: 0;
  flex: 1;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: ${props => `${props.theme.spacing.xs} ${props.theme.spacing.sm}`};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSize.xs};
  font-weight: ${props => props.theme.fontWeight.semibold};
  background-color: ${props => {
    if (props.$status === 'completed') return props.theme.colors.green[100];
    if (props.$status === 'in_progress') return props.theme.colors.primary[100];
    if (props.$status === 'cancelled') return props.theme.colors.red[100];
    return props.theme.colors.gray[100];
  }};
  color: ${props => {
    if (props.$status === 'completed') return props.theme.colors.green[700];
    if (props.$status === 'in_progress') return props.theme.colors.primary[700];
    if (props.$status === 'cancelled') return props.theme.colors.red[700];
    return props.theme.colors.gray[700];
  }};
`;

const TaskDescription = styled.p`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: ${props => props.theme.spacing.md};
  line-height: 1.6;
`;

const GitInfo = styled.div`
  background-color: ${props => props.theme.colors.gray[50]};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.xs};
  color: ${props => props.theme.colors.gray[600]};
`;

const DateInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.gray[600]};
`;

const DateItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const DateLabel = styled.span`
  font-size: ${props => props.theme.fontSize.xs};
  color: ${props => props.theme.colors.gray[500]};
`;

const DateValue = styled.span`
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.gray[700]};
`;

const ProgressSection = styled.div`
  margin-top: ${props => props.theme.spacing.md};
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ProgressLabel = styled.span`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.gray[700]};
`;

const ProgressPercent = styled.span`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.toss.blue};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${props => props.theme.colors.gray[200]};
  border-radius: ${props => props.theme.borderRadius.full};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background: linear-gradient(90deg, ${props => props.theme.colors.toss.blue} 0%, ${props => props.theme.colors.primary[500]} 100%);
  border-radius: ${props => props.theme.borderRadius.full};
  transition: width 0.3s ease;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['3xl']};
  color: ${props => props.theme.colors.gray[500]};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['3xl']};
  color: ${props => props.theme.colors.gray[500]};
`;

const statusLabels: Record<string, string> = {
  pending: '대기중',
  in_progress: '진행중',
  completed: '완료',
  cancelled: '취소됨',
};

const UserDashboard: React.FC = () => {
  const { user } = useFrontAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('업무 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateDaysRemaining = (endDate?: string) => {
    if (!endDate) return null;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  const averageProgress = tasks.length > 0
    ? Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length)
    : 0;

  return (
    <Layout>
      <Container>
        <PageHeader>
          <Title>업무 대시보드</Title>
          <Subtitle>
            안녕하세요, {user?.name}님! 커서를 통해 등록된 업무 현황을 확인하세요.
          </Subtitle>
        </PageHeader>

        <StatsGrid>
          <StatCard>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>전체 업무</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.completed}</StatValue>
            <StatLabel>완료된 업무</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.inProgress}</StatValue>
            <StatLabel>진행 중인 업무</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.pending}</StatValue>
            <StatLabel>대기 중인 업무</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{averageProgress}%</StatValue>
            <StatLabel>평균 진행률</StatLabel>
          </StatCard>
        </StatsGrid>

        <SectionTitle>커서를 통해 등록된 업무 목록</SectionTitle>

        {loading ? (
          <LoadingState>로딩 중...</LoadingState>
        ) : tasks.length === 0 ? (
          <EmptyState>
            <p>등록된 업무가 없습니다.</p>
          </EmptyState>
        ) : (
          <TaskGrid>
            {tasks.map((task) => {
              const daysRemaining = calculateDaysRemaining(task.end_date);
              return (
                <TaskCard key={task.id} $status={task.status}>
                  <TaskHeader>
                    <TaskTitle>{task.title}</TaskTitle>
                    <StatusBadge $status={task.status}>
                      {statusLabels[task.status]}
                    </StatusBadge>
                  </TaskHeader>

                  {task.description && (
                    <TaskDescription>{task.description}</TaskDescription>
                  )}

                  {task.git_summary && (
                    <GitInfo>
                      <strong>Git 요약:</strong> {task.git_summary}
                      {task.git_branch && (
                        <span style={{ marginLeft: '8px', color: '#666' }}>
                          ({task.git_branch})
                        </span>
                      )}
                      {task.git_commit_hash && (
                        <span style={{ marginLeft: '8px', color: '#999', fontSize: '0.7rem' }}>
                          [{task.git_commit_hash.substring(0, 7)}]
                        </span>
                      )}
                    </GitInfo>
                  )}

                  <DateInfo>
                    <DateItem>
                      <DateLabel>시작일</DateLabel>
                      <DateValue>{formatDate(task.start_date)}</DateValue>
                    </DateItem>
                    <DateItem>
                      <DateLabel>종료일</DateLabel>
                      <DateValue>
                        {formatDate(task.end_date)}
                        {daysRemaining !== null && daysRemaining >= 0 && (
                          <span style={{ 
                            marginLeft: '4px', 
                            color: daysRemaining <= 3 ? '#ef4444' : '#666',
                            fontSize: '0.75rem'
                          }}>
                            (D-{daysRemaining})
                          </span>
                        )}
                      </DateValue>
                    </DateItem>
                  </DateInfo>

                  <ProgressSection>
                    <ProgressHeader>
                      <ProgressLabel>진행률</ProgressLabel>
                      <ProgressPercent>{task.progress}%</ProgressPercent>
                    </ProgressHeader>
                    <ProgressBar>
                      <ProgressFill $progress={task.progress} />
                    </ProgressBar>
                  </ProgressSection>
                </TaskCard>
              );
            })}
          </TaskGrid>
        )}
      </Container>
    </Layout>
  );
};

export default UserDashboard;
