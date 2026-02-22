import { useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.visit('/login', { replace: true });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default ProtectedRoute;

