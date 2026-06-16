import { useEffect, useState } from 'react';
import { getUsers, type User } from '../services/users';

export function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  const usersMap = users.map((user) => (
    <tr key={user.id}>
      <td>{user.id}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <button type="button">Editar</button>
        <button type="button">Apagar</button>
      </td>
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Cargo</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>{usersMap}</tbody>
    </table>
  );
}
