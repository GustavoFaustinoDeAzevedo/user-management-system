import { useEffect, useMemo, useState } from 'react';
import { getUsers, type User, createUser } from '../services/users';
import { useAuth } from '../auth/useAuth';

type CheckedUser = User & {
  checked: boolean;
};

export function Admin() {
  const [users, setUsers] = useState<CheckedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRegister, setUserRegister] = useState({
    email: '',
    password: '',
    role: 'user',
  });

  const { user: currentUser } = useAuth();

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers();
        const checked = data.map((user) => ({ ...user, checked: false }));
        setUsers(checked);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.role !== 'admin')
          return { ...user, checked: e.target.checked };
        return user;
      }),
    );
  };

  const handleCheckUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === Number(e.target.name) && user.role !== 'admin'
          ? { ...user, checked: !user.checked }
          : user,
      ),
    );
  };

  const handleAddUser = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUser(userRegister).then((result) =>
      setUsers([...users, { ...result, checked: false }]),
    );
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
          <td>
            {((user.role === 'admin' && user.id === currentUser?.id) ||
              user.role !== 'admin') && (
              <input
                name={user.id.toString()}
                onChange={handleCheckUser}
                checked={user.checked}
                title="Selecionar todos"
                type="checkbox"
              />
            )}
          </td>
          <td>{user.id}</td>
          <td>{user.email}</td>
          <td>{user.role}</td>
          <td>
            {((user.role === 'admin' && user.id === currentUser?.id) ||
              user.role !== 'admin') && (
              <>
                <button type="button">Editar</button>
                <button type="button">Apagar</button>
              </>
            )}
          </td>
        </tr>
      )),
    [users],
  );

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <div className="admin__table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  onChange={handleCheckAll}
                  title="Selecionar todos"
                  type="checkbox"
                />
              </th>
              <th>ID</th>
              <th>Email</th>
              <th>Cargo</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>{usersMap}</tbody>
        </table>
      </div>
      <div className="admin__panel">
        <div className="admin__user-delete">
          <p>
            Usuários selecionados: {users.filter((user) => user.checked).length}
          </p>
          <button type="button">Apagar</button>
        </div>
        <div className="admin__user-register">
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
        </div>
      </div>
    </>
  );
}
