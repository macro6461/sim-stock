import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.tsx';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

   // Allow access to /forgot-password even if not authenticated
  if (!isAuthenticated && location.pathname === "/forgot-password") {
    return children;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};