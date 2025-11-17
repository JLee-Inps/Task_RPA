import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdminAuthStore } from '../../admin/auth/store/authStore';
import { useFrontAuthStore } from '../../front/auth/store/authStore';
import { ALL_ROUTES, PROTECTED_ROUTES } from './routes';

import AdminLoginForm from '../../admin/auth/components/AdminLoginForm';
import FrontLoginForm from '../../front/auth/components/FrontLoginForm';
import FrontRegisterForm from '../../front/auth/components/FrontRegisterForm';

import AdminProtectedRoute from '../../admin/auth/components/AdminProtectedRoute';
import FrontProtectedRoute from '../../front/auth/components/FrontProtectedRoute';

import AdminDashboard from '../../admin/pages/AdminDashboard';
import AdminUsers from '../../admin/pages/AdminUsers';
import UserDashboard from '../../front/pages/UserDashboard';
import UserProfile from '../../front/pages/UserProfile';
import TaskListPage from '../../front/pages/TaskList';
import TaskSchedulePage from '../../front/pages/TaskSchedule';
import TaskChartPage from '../../front/pages/TaskChart';
import GitTriggerPage from '../../front/pages/GitTrigger';
import NotFoundPage from '../../core/error/NotFoundPage';
import UnauthorizedPage from '../../core/error/UnauthorizedPage';

const AppRouter: React.FC = () => {
  const { checkAuth: checkAdminAuth, isAuthenticated: isAdminAuthenticated, isLoading: isAdminLoading } = useAdminAuthStore();
  const { checkAuth: checkFrontAuth, isAuthenticated: isFrontAuthenticated, isLoading: isFrontLoading } = useFrontAuthStore();

  useEffect(() => {
    // 초기 마운트 시에만 인증 확인 (로그인 직후가 아닐 때)
    // localStorage에 토큰이 있지만 store에 인증 상태가 없을 때만 확인
    const frontToken = localStorage.getItem('front-auth-storage');
    const adminToken = localStorage.getItem('admin-auth-storage');
    
    // 이미 인증되어 있으면 스킵
    if (isFrontAuthenticated || isAdminAuthenticated) {
      return;
    }
    
    if (frontToken && !isFrontLoading) {
      try {
        const authData = JSON.parse(frontToken);
        // localStorage에 토큰이 있지만 store에 인증 상태가 없을 때만 확인
        if (authData.state?.token && !isFrontAuthenticated) {
          checkFrontAuth();
        }
      } catch (e) {
        // 파싱 실패 시 무시
      }
    }
    
    if (adminToken && !isAdminLoading) {
      try {
        const authData = JSON.parse(adminToken);
        if (authData.state?.token && !isAdminAuthenticated) {
          checkAdminAuth();
        }
      } catch (e) {
        // 파싱 실패 시 무시
      }
    }
  }, []); // 빈 배열로 초기 마운트 시에만 실행

  return (
    <Routes>
      <Route path={ALL_ROUTES.LOGIN} element={<FrontLoginForm />} />
      <Route path={ALL_ROUTES.REGISTER} element={<FrontRegisterForm />} />

      <Route 
        path="/admin/login" 
        element={
          <AdminProtectedRoute redirectIfAuthenticated>
            <AdminLoginForm />
          </AdminProtectedRoute>
        } 
      />
      
      <Route
        path={ALL_ROUTES.ADMIN_DASHBOARD}
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      
      <Route
        path={ALL_ROUTES.ADMIN_USERS}
        element={
          <AdminProtectedRoute>
            <AdminUsers />
          </AdminProtectedRoute>
        }
      />

      <Route
        path={ALL_ROUTES.DASHBOARD}
        element={
          <FrontProtectedRoute>
            <UserDashboard />
          </FrontProtectedRoute>
        }
      />
      
      <Route
        path={ALL_ROUTES.PROFILE}
        element={
          <FrontProtectedRoute>
            <UserProfile />
          </FrontProtectedRoute>
        }
      />

      <Route
        path={PROTECTED_ROUTES.TASK_LIST}
        element={
          <FrontProtectedRoute>
            <TaskListPage />
          </FrontProtectedRoute>
        }
      />

      <Route
        path={PROTECTED_ROUTES.TASK_SCHEDULE}
        element={
          <FrontProtectedRoute>
            <TaskSchedulePage />
          </FrontProtectedRoute>
        }
      />

      <Route
        path={PROTECTED_ROUTES.TASK_CHART}
        element={
          <FrontProtectedRoute>
            <TaskChartPage />
          </FrontProtectedRoute>
        }
      />

      <Route
        path={PROTECTED_ROUTES.GIT_TRIGGER}
        element={
          <FrontProtectedRoute>
            <GitTriggerPage />
          </FrontProtectedRoute>
        }
      />

      <Route path={ALL_ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
      <Route path={ALL_ROUTES.NOT_FOUND} element={<NotFoundPage />} />

      <Route 
        path={ALL_ROUTES.HOME}
        element={
          isFrontAuthenticated ? 
            <Navigate to={ALL_ROUTES.DASHBOARD} replace /> : 
            isAdminAuthenticated ?
            <Navigate to={ALL_ROUTES.ADMIN_DASHBOARD} replace /> :
            <Navigate to={ALL_ROUTES.LOGIN} replace />
        } 
      />

      <Route path="*" element={<Navigate to={ALL_ROUTES.NOT_FOUND} replace />} />
    </Routes>
  );
};

export default AppRouter;

