import { api } from '../api/axios';

export interface User {
  id: number;
  email: string;
  role: string;
}

export async function getUsers(): Promise<User[]> {
  const response = await api.get('/users');

  return response.data.data;
}
