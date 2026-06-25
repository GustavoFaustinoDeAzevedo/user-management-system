import type { CheckedUser } from './Admin';

interface AdminPanelProps {
  users: CheckedUser[];
  userRegister: {
    email: string;
    password: string;
    role: string;
  };
  handleAddUser: (e: React.SubmitEvent<HTMLFormElement>) => void;
  handleUserRegisterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

const AdminPanel = (props: AdminPanelProps) => {
  const { users, handleAddUser, handleUserRegisterChange, userRegister } =
    props;

  return (
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
  );
};

export default AdminPanel;
