import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { AnimatePresence } from 'framer-motion';
import { Dashboard, Login } from './pages';
import { PublicRoute, PrivateRoute } from './routes';

function App() {
  const location = useLocation();

  const routes = [
    {
      path: '/',
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: '/login',
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: '/dashboard',
      element: (
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      ),
    },
  ];

  const renderRoutes = () => {
    return routes.map(({ path, element }) => (
      <Route key={path} path={path} element={element} />
    ));
  };

  return (
    <div className="app__container">
      <header></header>
      <main className="app__main">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {renderRoutes()}
          </Routes>
        </AnimatePresence>
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
