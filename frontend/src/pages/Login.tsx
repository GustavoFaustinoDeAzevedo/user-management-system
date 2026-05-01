import { useState } from 'react';
import { useAuth } from '../auth/useAuth';

import './login.css';

export const Login = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    await login(email, password);
  }

  return (
    <div className="login__container">
      <input
        title="email"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="login__email"
        required
      />
      <input
        title="password"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="login__password"
        required
      />
      <button type="button" onClick={handleLogin} className="login__button">
        Login
      </button>
    </div>
  );
};
