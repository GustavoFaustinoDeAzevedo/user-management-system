import './App.css';
import { Login } from './pages/Login';

function App() {
  return (
    <div className="app__container">
      <header></header>
      <main>
        <h1>Teste de Login</h1>
        <Login />
      </main>
      <footer>
        <div>
          <h2>Admin</h2>
          <p>
            <strong>Email:</strong> admin@email.com
          </p>
          <p>
            <strong>Senha:</strong> Admin@123
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
