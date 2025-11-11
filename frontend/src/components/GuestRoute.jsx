import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const GuestRoute = () => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <div className="status-message">로딩 중...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;

