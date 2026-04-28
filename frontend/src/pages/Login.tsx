import { useState } from 'react';
import { useAuth } from '../auth/useAuth';

export const Login = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    await login(email, password);
  }

  return (
    <div>
      <input title="email" onChange={(e) => setEmail(e.target.value)} />
      <input
        title="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="button" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};
