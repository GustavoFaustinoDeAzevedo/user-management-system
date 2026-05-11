import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { Login } from './pages/Login';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const location = useLocation();
  return (
    <div className="app__container">
      <header></header>
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.02, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Routes>
              <Route path={'/'} element={<Login />} />
              <Route path={'/login'} element={<Login />} />
            </Routes>
          </motion.div>
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
