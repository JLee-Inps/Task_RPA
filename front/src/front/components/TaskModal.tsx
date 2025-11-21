import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import taskService, { CreateTaskRequest, UpdateTaskRequest, Task } from '../services/taskService';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task?: Task | null; // task가 있으면 수정 모드, 없으면 생성 모드
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.lg};
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: ${props => props.theme.spacing['2xl']};
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${props => props.theme.shadows.lg};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ModalTitle = styled.h2`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.gray[800]};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${props => props.theme.fontSize['2xl']};
  color: ${props => props.theme.colors.gray[500]};
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.full};
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
    color: ${props => props.theme.colors.gray[700]};
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
`;

const FormField = styled.div`
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.gray[700]};
`;

const Input = styled.input`
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  padding: ${props => `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
  font-size: ${props => props.theme.fontSize.sm};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.toss.blue};
  }
`;

const TextArea = styled.textarea`
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  padding: ${props => `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
  font-size: ${props => props.theme.fontSize.sm};
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.toss.blue};
  }
`;

const Select = styled.select`
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.gray[200]};
  padding: ${props => `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
  font-size: ${props => props.theme.fontSize.sm};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.toss.blue};
  }
`;

const SmallText = styled.p`
  font-size: ${props => props.theme.fontSize.xs};
  color: ${props => props.theme.colors.gray[500]};
  margin: 0;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.xl};
`;

const PrimaryButton = styled.button`
  padding: ${props => `${props.theme.spacing.sm} ${props.theme.spacing.lg}`};
  border-radius: ${props => props.theme.borderRadius.lg};
  background-color: ${props => props.theme.colors.toss.blue};
  color: ${props => props.theme.colors.white};
  font-weight: ${props => props.theme.fontWeight.semibold};
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.primary[700]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  padding: ${props => `${props.theme.spacing.sm} ${props.theme.spacing.lg}`};
  border-radius: ${props => props.theme.borderRadius.lg};
  background-color: ${props => props.theme.colors.gray[100]};
  color: ${props => props.theme.colors.gray[700]};
  font-weight: ${props => props.theme.fontWeight.semibold};
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.gray[200]};
  }
`;

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSuccess, task }) => {
  const isEditMode = !!task;
  const [formData, setFormData] = useState<CreateTaskRequest & UpdateTaskRequest>({
    title: '',
    assignee: '',
    watchers: [],
    content: '',
    due_date: '',
    parent_task_id: null,
    priority: 'medium',
    progress: 0,
    start_date: '',
    end_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [watchersInput, setWatchersInput] = useState('');
  const [parentTasks, setParentTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadParentTasks();
      if (task) {
        // 수정 모드: 기존 데이터 로드
        setFormData({
          title: task.title || '',
          assignee: task.assignee || '',
          watchers: task.watchers || [],
          content: task.content || '',
          due_date: task.due_date ? task.due_date.split('T')[0] : '',
          parent_task_id: task.parent_task_id || null,
          priority: task.priority || 'medium',
          progress: task.progress || 0,
          start_date: task.start_date ? task.start_date.split('T')[0] : '',
          end_date: task.end_date ? task.end_date.split('T')[0] : '',
          status: task.status,
        });
        setWatchersInput(task.watchers ? task.watchers.join(', ') : '');
      } else {
        // 생성 모드: 폼 초기화
        setFormData({
          title: '',
          assignee: '',
          watchers: [],
          content: '',
          due_date: '',
          parent_task_id: null,
          priority: 'medium',
          progress: 0,
          start_date: '',
          end_date: '',
        });
        setWatchersInput('');
      }
    }
  }, [isOpen, task]);

  const loadParentTasks = async () => {
    try {
      const tasks = await taskService.getTasks({ include_children: false });
      // 수정 모드일 때는 자기 자신을 제외
      const filtered = task ? tasks.filter(t => t.id !== task.id) : tasks;
      setParentTasks(filtered);
    } catch (error) {
      console.error('상위 업무 목록 로드 실패:', error);
    }
  };

  const handleChange = (field: keyof (CreateTaskRequest & UpdateTaskRequest), value: string | string[] | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWatchersChange = (value: string) => {
    setWatchersInput(value);
    const watchers = value
      .split(',')
      .map(w => w.trim())
      .filter(Boolean);
    handleChange('watchers', watchers);
  };

  const handleSubmit = async () => {
    if (!formData.title?.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      
      if (isEditMode && task) {
        // 수정 모드
        const updateData: UpdateTaskRequest = {
          title: formData.title,
          assignee: formData.assignee || undefined,
          watchers: formData.watchers && formData.watchers.length > 0 ? formData.watchers : undefined,
          content: formData.content || undefined,
          due_date: formData.due_date ? `${formData.due_date}T00:00:00Z` : undefined,
          parent_task_id: formData.parent_task_id || undefined,
          priority: formData.priority,
          progress: formData.progress,
          start_date: formData.start_date ? `${formData.start_date}T00:00:00Z` : undefined,
          end_date: formData.end_date ? `${formData.end_date}T00:00:00Z` : undefined,
          status: formData.status,
        };
        await taskService.updateTask(task.id, updateData);
      } else {
        // 생성 모드
        const createData: CreateTaskRequest = {
          title: formData.title,
          assignee: formData.assignee || undefined,
          watchers: formData.watchers && formData.watchers.length > 0 ? formData.watchers : undefined,
          content: formData.content || undefined,
          due_date: formData.due_date ? `${formData.due_date}T00:00:00Z` : undefined,
          parent_task_id: formData.parent_task_id || undefined,
          priority: formData.priority,
          progress: formData.progress || 0,
          start_date: formData.start_date ? `${formData.start_date}T00:00:00Z` : undefined,
          end_date: formData.end_date ? `${formData.end_date}T00:00:00Z` : undefined,
        };
        await taskService.createTask(createData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('업무 저장 실패:', error);
      alert(`${isEditMode ? '수정' : '생성'}에 실패했습니다. 다시 시도해주세요.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, loading]);

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{isEditMode ? '업무 수정' : '새 업무 작성'}</ModalTitle>
          <CloseButton onClick={handleClose} disabled={loading}>
            ×
          </CloseButton>
        </ModalHeader>

        <FormRow>
          <FormField style={{ flex: '1 1 100%' }}>
            <Label>제목 *</Label>
            <Input
              value={formData.title || ''}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="업무 제목을 입력하세요"
              disabled={loading}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField>
            <Label>상위 업무 (선택사항)</Label>
            <Select
              value={formData.parent_task_id || ''}
              onChange={e => handleChange('parent_task_id', e.target.value ? parseInt(e.target.value) : null)}
              disabled={loading}
            >
              <option value="">상위 업무 없음 (최상위 업무)</option>
              {parentTasks.map(parentTask => (
                <option key={parentTask.id} value={parentTask.id}>
                  {parentTask.title}
                </option>
              ))}
            </Select>
            <SmallText>하위 업무로 등록하려면 상위 업무를 선택하세요.</SmallText>
          </FormField>
          <FormField>
            <Label>우선순위</Label>
            <Select
              value={formData.priority || 'medium'}
              onChange={e => handleChange('priority', e.target.value as 'low' | 'medium' | 'high')}
              disabled={loading}
            >
              <option value="low">낮음</option>
              <option value="medium">보통</option>
              <option value="high">높음</option>
            </Select>
          </FormField>
          {isEditMode && (
            <FormField>
              <Label>상태</Label>
              <Select
                value={formData.status || 'pending'}
                onChange={e => handleChange('status', e.target.value as 'pending' | 'in_progress' | 'completed' | 'cancelled')}
                disabled={loading}
              >
                <option value="pending">대기</option>
                <option value="in_progress">진행중</option>
                <option value="completed">완료</option>
                <option value="cancelled">취소됨</option>
              </Select>
            </FormField>
          )}
        </FormRow>

        <FormRow>
          <FormField>
            <Label>시작일</Label>
            <Input
              type="date"
              value={formData.start_date || ''}
              onChange={e => handleChange('start_date', e.target.value)}
              disabled={loading}
            />
          </FormField>
          <FormField>
            <Label>종료일</Label>
            <Input
              type="date"
              value={formData.end_date || ''}
              onChange={e => handleChange('end_date', e.target.value)}
              disabled={loading}
            />
          </FormField>
          <FormField>
            <Label>업무 만기일</Label>
            <Input
              type="date"
              value={formData.due_date || ''}
              onChange={e => handleChange('due_date', e.target.value)}
              disabled={loading}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField>
            <Label>담당자</Label>
            <Input
              value={formData.assignee || ''}
              onChange={e => handleChange('assignee', e.target.value)}
              placeholder="담당자 이름 또는 이메일"
              disabled={loading}
            />
          </FormField>
          <FormField>
            <Label>참조자</Label>
            <Input
              value={watchersInput}
              onChange={e => handleWatchersChange(e.target.value)}
              placeholder="쉼표(,)로 여러 명 입력"
              disabled={loading}
            />
            <SmallText>예: dev1@toss.com, pm@toss.com</SmallText>
          </FormField>
          {isEditMode && (
            <FormField>
              <Label>진행률 (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.progress || 0}
                onChange={e => handleChange('progress', parseInt(e.target.value) || 0)}
                disabled={loading}
              />
            </FormField>
          )}
        </FormRow>

        <FormRow>
          <FormField style={{ flex: '1 1 100%' }}>
            <Label>본문 내용</Label>
            <TextArea
              value={formData.content || ''}
              onChange={e => handleChange('content', e.target.value)}
              placeholder="업무 내용을 자유롭게 입력하세요."
              disabled={loading}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField style={{ flex: '1 1 100%' }}>
            <Label>파일 첨부</Label>
            <Input type="file" multiple disabled={loading} />
            <SmallText>현재는 파일 이름만 저장하며, 실제 파일 업로드는 추후 S3 등으로 연동 예정.</SmallText>
          </FormField>
        </FormRow>

        <ButtonRow>
          <SecondaryButton onClick={handleClose} disabled={loading}>
            취소
          </SecondaryButton>
          <PrimaryButton onClick={handleSubmit} disabled={loading}>
            {loading ? '저장 중...' : isEditMode ? '수정' : '저장'}
          </PrimaryButton>
        </ButtonRow>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TaskModal;

