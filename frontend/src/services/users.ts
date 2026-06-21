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

export async function deleteUser(userId: number): Promise<void> {
  await api.delete(`/users/${userId}`);
}

export async function updateUserById(
  userId: number,
  user: User,
): Promise<User> {
  const response = await api.patch(`/users/${userId}`, user);

  return response.data.data;
}

export async function createUser(user: {
  email: string;
  password: string;
  role: string;
}): Promise<User> {
  const response = await api.post('/users/register', user);

  return response.data.data;
}
