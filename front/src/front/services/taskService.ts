/**
 * 업무(Task) 관련 서비스
 */

import apiClient from '../../core/http/axios';
import env from '../../core/config/env';

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  git_commit_hash?: string;
  git_branch?: string;
  git_summary?: string;
  start_date?: string;
  end_date?: string;
  due_date?: string;
  progress: number; // 0-100
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  start_date?: string;
  end_date?: string;
  due_date?: string;
  progress?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  start_date?: string;
  end_date?: string;
  due_date?: string;
  progress?: number;
}

// Mock 업무 데이터 (커서를 통해 등록된 업무)
const mockTasks: Task[] = [
  {
    id: 1,
    user_id: 1,
    title: '사용자 인증 시스템 구현',
    description: 'JWT 기반 인증 시스템을 구현하고 로그인/회원가입 기능을 완성합니다.',
    status: 'completed',
    priority: 'high',
    git_commit_hash: 'a1b2c3d4e5f6',
    git_branch: 'main',
    git_summary: 'JWT 인증 시스템 구현 완료. 로그인, 회원가입, 토큰 갱신 기능 추가.',
    start_date: '2024-01-15T09:00:00Z',
    end_date: '2024-01-20T18:00:00Z',
    due_date: '2024-01-20T18:00:00Z',
    progress: 100,
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-20T18:00:00Z',
  },
  {
    id: 2,
    user_id: 1,
    title: '업무 목록 페이지 UI 개발',
    description: '업무 목록을 표시하고 필터링 및 정렬 기능을 구현합니다.',
    status: 'in_progress',
    priority: 'high',
    git_commit_hash: 'b2c3d4e5f6a7',
    git_branch: 'feature/task-list',
    git_summary: '업무 목록 컴포넌트 생성. 진행률 표시 및 날짜 필터링 기능 추가.',
    start_date: '2024-01-21T09:00:00Z',
    end_date: '2024-01-28T18:00:00Z',
    due_date: '2024-01-28T18:00:00Z',
    progress: 65,
    created_at: '2024-01-21T09:00:00Z',
    updated_at: '2024-01-24T14:30:00Z',
  },
  {
    id: 3,
    user_id: 1,
    title: '차트 컴포넌트 구현',
    description: '업무 진행 현황을 시각화하는 차트 컴포넌트를 개발합니다.',
    status: 'pending',
    priority: 'medium',
    git_commit_hash: 'c3d4e5f6a7b8',
    git_branch: 'feature/charts',
    git_summary: 'Chart.js를 활용한 진행률 차트 컴포넌트 설계 완료.',
    start_date: '2024-01-25T09:00:00Z',
    end_date: '2024-02-01T18:00:00Z',
    due_date: '2024-02-01T18:00:00Z',
    progress: 0,
    created_at: '2024-01-25T09:00:00Z',
    updated_at: '2024-01-25T09:00:00Z',
  },
  {
    id: 4,
    user_id: 1,
    title: 'Git 커밋 자동화 스크립트',
    description: '커서에서 Git 커밋을 자동으로 수행하는 스크립트를 작성합니다.',
    status: 'in_progress',
    priority: 'high',
    git_commit_hash: 'd4e5f6a7b8c9',
    git_branch: 'feature/git-automation',
    git_summary: 'Git 커밋 자동화 스크립트 초기 버전 완성. GPT API 연동 준비 중.',
    start_date: '2024-01-22T09:00:00Z',
    end_date: '2024-01-30T18:00:00Z',
    due_date: '2024-01-30T18:00:00Z',
    progress: 45,
    created_at: '2024-01-22T09:00:00Z',
    updated_at: '2024-01-24T16:00:00Z',
  },
  {
    id: 5,
    user_id: 1,
    title: '데이터베이스 스키마 최적화',
    description: '성능 향상을 위한 인덱스 추가 및 쿼리 최적화 작업을 진행합니다.',
    status: 'pending',
    priority: 'low',
    start_date: '2024-02-01T09:00:00Z',
    end_date: '2024-02-05T18:00:00Z',
    due_date: '2024-02-05T18:00:00Z',
    progress: 0,
    created_at: '2024-02-01T09:00:00Z',
    updated_at: '2024-02-01T09:00:00Z',
  },
];

// Mock 함수들
const mockGetTasks = async (): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTasks);
    }, 500);
  });
};

const mockCreateTask = async (data: CreateTaskRequest): Promise<Task> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTask: Task = {
        id: mockTasks.length + 1,
        user_id: 1,
        title: data.title,
        description: data.description,
        status: 'pending',
        priority: data.priority || 'medium',
        start_date: data.start_date,
        end_date: data.end_date,
        due_date: data.due_date,
        progress: data.progress || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockTasks.push(newTask);
      resolve(newTask);
    }, 500);
  });
};

const mockUpdateTask = async (id: number, data: UpdateTaskRequest): Promise<Task> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const taskIndex = mockTasks.findIndex(t => t.id === id);
      if (taskIndex === -1) {
        reject(new Error('업무를 찾을 수 없습니다.'));
        return;
      }
      const updatedTask = { ...mockTasks[taskIndex], ...data, updated_at: new Date().toISOString() };
      mockTasks[taskIndex] = updatedTask;
      resolve(updatedTask);
    }, 500);
  });
};

const mockDeleteTask = async (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const taskIndex = mockTasks.findIndex(t => t.id === id);
      if (taskIndex === -1) {
        reject(new Error('업무를 찾을 수 없습니다.'));
        return;
      }
      mockTasks.splice(taskIndex, 1);
      resolve();
    }, 500);
  });
};

// 실제 API 호출 함수들
const getTasks = async (params?: { status?: string; start_date?: string; end_date?: string }): Promise<Task[]> => {
  if (env.REACT_APP_USE_MOCK) {
    console.log('📝 Mock 데이터로 업무 목록 조회');
    return mockGetTasks();
  }

  const response = await apiClient.get('/tasks/list', { params });
  return response.data.tasks;
};

const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  if (env.REACT_APP_USE_MOCK) {
    console.log('📝 Mock 데이터로 업무 생성');
    return mockCreateTask(data);
  }

  const response = await apiClient.post('/tasks/create', data);
  return response.data.task;
};

const updateTask = async (id: number, data: UpdateTaskRequest): Promise<Task> => {
  if (env.REACT_APP_USE_MOCK) {
    console.log('📝 Mock 데이터로 업무 수정');
    return mockUpdateTask(id, data);
  }

  const response = await apiClient.put(`/tasks/${id}`, data);
  return response.data.task;
};

const deleteTask = async (id: number): Promise<void> => {
  if (env.REACT_APP_USE_MOCK) {
    console.log('📝 Mock 데이터로 업무 삭제');
    return mockDeleteTask(id);
  }

  await apiClient.delete(`/tasks/${id}`);
};

const taskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};

export default taskService;
