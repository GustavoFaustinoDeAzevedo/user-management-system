import { useContext } from 'react';
import { AuthContext } from './authConthext';

export const useAuth = () => {
  return useContext(AuthContext);
};
