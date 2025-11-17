import React from 'react';
import styled from 'styled-components';
import { useAdminAuthStore } from '../../auth/store/authStore';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.gray[50]};
`;

const Header = styled.header`
  background-color: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadows.md};
  border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
  backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.toss.blue};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
`;

const NavLink = styled.button`
  color: ${props => props.theme.colors.gray[600]};
  font-weight: ${props => props.theme.fontWeight.medium};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.toss.blue};
    background-color: ${props => props.theme.colors.gray[50]};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const UserName = styled.span`
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.gray[700]};
`;

const LogoutButton = styled.button`
  color: ${props => props.theme.colors.gray[500]};
  font-size: ${props => props.theme.fontSize.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;
  background: none;
  border: 1px solid ${props => props.theme.colors.gray[200]};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.error[600]};
    border-color: ${props => props.theme.colors.error[200]};
    background-color: ${props => props.theme.colors.error[50]};
  }
`;

const Main = styled.main`
  flex: 1;
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { admin, logout } = useAdminAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <LayoutContainer>
      <Header>
        <HeaderContent>
          <Logo>
            🔧 관리자 패널
          </Logo>
          
          <Nav>
            <NavLink>대시보드</NavLink>
            <NavLink>사용자 관리</NavLink>
            <NavLink>설정</NavLink>
          </Nav>
          
          <UserInfo>
            <UserName>{admin?.name}</UserName>
            <LogoutButton onClick={handleLogout}>
              로그아웃
            </LogoutButton>
          </UserInfo>
        </HeaderContent>
      </Header>
      
      <Main>
        {children}
      </Main>
    </LayoutContainer>
  );
};

export default Layout;
