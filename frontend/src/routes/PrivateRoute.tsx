import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useEffect } from 'react';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setTimeout(() => {
        navigate('/login');
      }, 100);
    }
  }, [token]);

  return children;
};

export default PrivateRoute;
