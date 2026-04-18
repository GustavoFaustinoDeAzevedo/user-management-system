import { RegisterResponse, User } from './user.types';
import { validateUser } from './user.validator';

let id = 1;

const users: User[] = [];

export function createUser(input: unknown): RegisterResponse {
  const result = validateUser(input);

  if (!result.success) {
    return result;
  }

  const { email } = result.data;

  const user = { id: id++, email };
  users.push(user);

  return {
    success: true,
    data: user,
  };
}

export function getUsers(): User[] {
  return users;
}
