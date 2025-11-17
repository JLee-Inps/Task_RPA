import React, { useState } from 'react';
import styled from 'styled-components';
import { useAdminAuthStore } from '../auth/store/authStore';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

// 임시 사용자 데이터
const mockUsers = [
  {
    id: '1',
    name: '홍길동',
    email: 'hong@example.com',
    role: 'user',
    createdAt: '2024-01-15',
    status: 'active',
  },
  {
    id: '2',
    name: '김철수',
    email: 'kim@example.com',
    role: 'admin',
    createdAt: '2024-01-10',
    status: 'active',
  },
  {
    id: '3',
    name: '이영희',
    email: 'lee@example.com',
    role: 'user',
    createdAt: '2024-01-20',
    status: 'inactive',
  },
];

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

const UsersCard = styled.div`
  background-color: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadows.md};
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const CardHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
`;

const CardHeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.gray[900]};
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  min-width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${props => props.theme.colors.gray[50]};
`;

const TableHeader = styled.th`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  text-align: left;
  font-size: ${props => props.theme.fontSize.xs};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.gray[500]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableBody = styled.tbody`
  background-color: ${props => props.theme.colors.white};
`;

const TableRow = styled.tr<{ $selected?: boolean }>`
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  
  ${props => props.$selected && `
    background-color: ${props.theme.colors.primary[50]};
  `}

  &:nth-child(even) {
    background-color: ${props => props.$selected ? props.theme.colors.primary[50] : props.theme.colors.gray[50]};
  }
`;

const TableCell = styled.td`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  white-space: nowrap;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background-color: ${props => props.theme.colors.primary[600]};
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${props => props.theme.spacing.md};
`;

const AvatarText = styled.span`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
`;

const UserDetails = styled.div``;

const UserName = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.gray[900]};
`;

const UserEmail = styled.div`
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.gray[500]};
`;

const Badge = styled.span<{ $variant: 'admin' | 'user' | 'active' | 'inactive' }>`
  display: inline-flex;
  align-items: center;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSize.xs};
  font-weight: ${props => props.theme.fontWeight.medium};

  ${props => {
    switch (props.$variant) {
      case 'admin':
        return `
          background-color: ${props.theme.colors.purple[100]};
          color: ${props.theme.colors.purple[800]};
        `;
      case 'user':
        return `
          background-color: ${props.theme.colors.gray[100]};
          color: ${props.theme.colors.gray[800]};
        `;
      case 'active':
        return `
          background-color: ${props.theme.colors.green[100]};
          color: ${props.theme.colors.green[800]};
        `;
      case 'inactive':
        return `
          background-color: ${props.theme.colors.red[100]};
          color: ${props.theme.colors.red[800]};
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const StatsGrid = styled.div`
  margin-top: ${props => props.theme.spacing['2xl']};
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing.lg};

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;

const StatTitle = styled.h3`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.gray[900]};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatValue = styled.p<{ $color: string }>`
  font-size: ${props => props.theme.fontSize['3xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.$color};
`;

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  return (
    <Layout>
      <Container>
        <Header>
          <Title>사용자 관리</Title>
          <Subtitle>시스템의 모든 사용자를 관리하세요.</Subtitle>
        </Header>

        {/* 사용자 목록 */}
        <UsersCard>
          <CardHeader>
            <CardHeaderContent>
              <CardTitle>사용자 목록</CardTitle>
              <Button variant="primary" size="sm">
                새 사용자 추가
              </Button>
            </CardHeaderContent>
          </CardHeader>

          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <TableHeader>사용자</TableHeader>
                  <TableHeader>역할</TableHeader>
                  <TableHeader>상태</TableHeader>
                  <TableHeader>가입일</TableHeader>
                  <TableHeader>작업</TableHeader>
                </tr>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} $selected={selectedUser === user.id}>
                    <TableCell>
                      <UserInfo>
                        <Avatar>
                          <AvatarText>
                            {user.name.charAt(0)}
                          </AvatarText>
                        </Avatar>
                        <UserDetails>
                          <UserName>{user.name}</UserName>
                          <UserEmail>{user.email}</UserEmail>
                        </UserDetails>
                      </UserInfo>
                    </TableCell>
                    <TableCell>
                      <Badge $variant={user.role as 'admin' | 'user'}>
                        {user.role === 'admin' ? '관리자' : '사용자'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge $variant={user.status as 'active' | 'inactive'}>
                        {user.status === 'active' ? '활성' : '비활성'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                    </TableCell>
                    <TableCell>
                      <ActionButtons>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(user.id)}
                        >
                          편집
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleUserStatus(user.id)}
                        >
                          {user.status === 'active' ? '비활성화' : '활성화'}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          삭제
                        </Button>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </UsersCard>

        {/* 통계 */}
        <StatsGrid>
          <StatCard>
            <StatTitle>총 사용자</StatTitle>
            <StatValue $color="#2563eb">{users.length}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>활성 사용자</StatTitle>
            <StatValue $color="#16a34a">
              {users.filter(user => user.status === 'active').length}
            </StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>관리자</StatTitle>
            <StatValue $color="#9333ea">
              {users.filter(user => user.role === 'admin').length}
            </StatValue>
          </StatCard>
        </StatsGrid>
      </Container>
    </Layout>
  );
};

export default AdminUsers;