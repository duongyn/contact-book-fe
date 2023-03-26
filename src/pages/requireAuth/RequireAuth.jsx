import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { showErrorMessage } from '../../util/toastdisplay';

function RequireAuth({ allowedRoles }) {
  var now = new Date().getTime();
  var setupTime = localStorage.getItem('setupTime');
  const { user } = useAuth();
  if (setupTime == null) {
    localStorage.setItem('setupTime', now);
  } else {
    if (now - setupTime > 60 * 60 * 1000) {
      localStorage.clear();
      localStorage.setItem('setupTime', now);
      showErrorMessage("Your session has expired. Please login again.");
      return <Navigate to={'/login'} replace />;
    }
  }

  if (!user) {
    return <Navigate to={'/login'} replace />;
  }

  return <Outlet />;
}

export default RequireAuth;
