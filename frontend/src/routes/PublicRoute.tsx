import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useEffect } from 'react';

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    }
  }, [accessToken]);

  return children;
};

export default PublicRoute;
