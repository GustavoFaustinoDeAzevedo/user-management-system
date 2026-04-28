import { useEffect } from 'react';
import { api } from '../api/axios';

export const Dashboard = () => {
  useEffect(() => {
    api.get('/users').then(console.log);
  }, []);

  return <h1>Dashboard</h1>;
};
