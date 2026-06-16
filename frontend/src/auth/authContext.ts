import { createContext } from 'react';
import type { User } from '../services/users';

type AuthContextType = {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: User | null;
};

export const AuthContext = createContext({} as AuthContextType);
