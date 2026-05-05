import { useState } from 'react';
import { api } from '../api/axios';
import { AuthContext } from './authConthext';

export const AuthProvider = ({ children }: any) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  async function login(email: string, password: string) {
    console.log('Tentando login com:', { email, password });

    try {
      const res = await api.post('/users/login', { email, password });

      console.log('Resposta do backend:', res.data);

      const { accessToken, refreshToken } = res.data.data;

      setAccessToken(accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      console.log('Erro no login:', error);
      throw error;
    }
  }

  async function logout() {
    const refreshToken = localStorage.getItem('refreshToken');

    await api.post('/users/logout', { refreshToken });

    setAccessToken(null);
    localStorage.removeItem('refreshToken');
  }

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
