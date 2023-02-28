import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function RequireAuth({ allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={'/login'} replace />;
  }

  return <Outlet />;
}

export default RequireAuth;
