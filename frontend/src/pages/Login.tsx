import { useState } from 'react';
import { useAuth } from '../auth/useAuth';

import './login.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Login = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    await login(email, password);

    navigate('/dashboard');
  }

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.98, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="login__container">
        <h1>Teste de Login</h1>
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
    </motion.div>
  );
};
