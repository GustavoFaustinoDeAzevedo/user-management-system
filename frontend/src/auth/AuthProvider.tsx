import { useState, type JSX } from 'react';
import { api, setAccessToken as setAxiosAccessToken } from '../api/axios';
import { AuthContext } from './authContext';
import type { User } from '../services/users';

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  async function login(email: string, password: string) {
    console.log('Tentando login com:', { email, password });

    try {
      const res = await api.post('/users/login', { email, password });

      console.log('Resposta do backend:', res.data);

      const { accessToken, refreshToken, user } = res.data.data;

      setToken(accessToken);
      setAxiosAccessToken(accessToken);
      setLoggedUser(user);

      localStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      console.log('Erro no login:', error);
      throw error;
    }
  }

  async function logout() {
    const refreshToken = localStorage.getItem('refreshToken');

    await api.post('/users/logout', { refreshToken });

    setToken(null);
    setAxiosAccessToken('');

    localStorage.removeItem('refreshToken');
  }

  return (
    <AuthContext.Provider value={{ token, user: loggedUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
