import { useEffect, useMemo, useState } from 'react';
import { getUsers, type User, createUser } from '../services/users';

export function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRegister, setUserRegister] = useState({
    email: '',
    password: '',
    role: 'user',
  });

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

  const handleAddUser = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUser(userRegister).then((result) => setUsers([...users, result]));
  };

  const handleUserRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setUserRegister({ ...userRegister, [e.target.name]: e.target.value });
  };

  const usersMap = useMemo(
    () =>
      users.map((user) => (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.email}</td>
          <td>{user.role}</td>
          <td>
            <button type="button">Editar</button>
            <button type="button">Apagar</button>
          </td>
        </tr>
      )),
    [users],
  );

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="admin__table-container">
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
        <tfoot>
          <tr>
            <td colSpan={4}>
              <p>Adicionar Usuário</p>
              <form onSubmit={handleAddUser}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={userRegister.email}
                  onChange={handleUserRegisterChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Senha"
                  value={userRegister.password}
                  onChange={handleUserRegisterChange}
                />
                <div>
                  Cargo: &nbsp;&nbsp;
                  <select
                    title="Cargo"
                    name="role"
                    value={userRegister.role}
                    onChange={handleUserRegisterChange}
                  >
                    <option value="user">Usuário</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <button type="submit">Registrar</button>
              </form>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
