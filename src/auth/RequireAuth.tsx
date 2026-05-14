import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { useAuth } from './AuthProvider';

export function RequireAuth() {
  const { isConfigured, isLoading, session } = useAuth();
  const location = useLocation();

  if (!isConfigured) {
    return <LoginPage mode="setup" />;
  }

  if (isLoading) {
    return <div className="loading-state">로그인 상태를 확인하는 중입니다...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
