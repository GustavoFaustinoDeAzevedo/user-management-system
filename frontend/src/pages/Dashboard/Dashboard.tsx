import { useAuth } from '../../auth/useAuth';
import { Admin } from '../Admin';
import './dashboard.css';

export const Dashboard = () => {
  const { logout, user } = useAuth();
  return (
    <div className="dashboard__container">
      <nav>
        {user?.role === 'admin' ? (
          <h4>Painel do Admin</h4>
        ) : (
          <h4>Painel do Usuário</h4>
        )}
        <p>Olá, {user?.email}</p>
        <button type="button" onClick={logout}>
          Sair
        </button>
      </nav>
      {user?.role === 'admin' && (
        <div className="dashboard__admin">
          <Admin />
        </div>
      )}
    </div>
  );
};
