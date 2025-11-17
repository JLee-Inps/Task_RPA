import React, { useState } from 'react';
import styled from 'styled-components';
import { useFrontAuthStore } from '../auth/store/authStore';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Container = styled.div`
  max-width: 42rem;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.md};
`;

const ProfileCard = styled.div`
  background-color: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadows.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.gray[900]};
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const Avatar = styled.div`
  width: 5rem;
  height: 5rem;
  background-color: ${props => props.theme.colors.primary[600]};
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarText = styled.span`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h3`
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.gray[900]};
`;

const UserEmail = styled.p`
  color: ${props => props.theme.colors.gray[600]};
`;

const FormSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing.lg};
`;

const FormField = styled.div``;

const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.gray[700]};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const Value = styled.p`
  color: ${props => props.theme.colors.gray[900]};
`;

const RoleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSize.xs};
  font-weight: ${props => props.theme.fontWeight.medium};
  background-color: ${props => props.theme.colors.purple[100]};
  color: ${props => props.theme.colors.purple[800]};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
`;

const UserProfile: React.FC = () => {
  const { user } = useFrontAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    // TODO: 프로필 업데이트 API 호출
    console.log('프로필 저장:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  return (
    <Layout>
      <Container>
        <ProfileCard>
          <Header>
            <Title>프로필</Title>
            {!isEditing && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                편집
              </Button>
            )}
          </Header>

          <ProfileSection>
            {/* 프로필 이미지 */}
            <AvatarSection>
              <Avatar>
                <AvatarText>
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarText>
              </Avatar>
              <UserInfo>
                <UserName>{user?.name}</UserName>
                <UserEmail>{user?.email}</UserEmail>
              </UserInfo>
            </AvatarSection>

            {/* 프로필 정보 */}
            <FormSection>
              <FormField>
                <Label>이름</Label>
                {isEditing ? (
                  <Input
                    value={formData.name}
                    onChange={(value: string) => setFormData(prev => ({ ...prev, name: value }))}
                    placeholder="이름을 입력하세요"
                  />
                ) : (
                  <Value>{user?.name}</Value>
                )}
              </FormField>

              <FormField>
                <Label>이메일</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(value: string) => setFormData(prev => ({ ...prev, email: value }))}
                    placeholder="이메일을 입력하세요"
                  />
                ) : (
                  <Value>{user?.email}</Value>
                )}
              </FormField>

              <FormField>
                <Label>역할</Label>
                <RoleContainer>
                  <Value>
                    {user?.role === 'premium_user' ? '프리미엄 사용자' : '일반 사용자'}
                  </Value>
                  {user?.role === 'premium_user' && (
                    <RoleBadge>프리미엄</RoleBadge>
                  )}
                </RoleContainer>
              </FormField>

              <FormField>
                <Label>가입일</Label>
                <Value>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR') : 'N/A'}
                </Value>
              </FormField>
            </FormSection>

            {/* 편집 버튼들 */}
            {isEditing && (
              <ButtonContainer>
                <Button
                  variant="primary"
                  onClick={handleSave}
                >
                  저장
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  취소
                </Button>
              </ButtonContainer>
            )}
          </ProfileSection>
        </ProfileCard>
      </Container>
    </Layout>
  );
};

export default UserProfile;