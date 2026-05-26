import { useAuth } from '../../auth/useAuth';
import './dashboard.css';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, x: '200%' }}
      animate={{ opacity: 1, x: '100%' }}
      exit={{ opacity: 0, x: '200%' }}
      transition={{ duration: 0.5 }}
      className="dashboard__container"
    >
      <nav>
        <button type="button" onClick={logout}>
          Sair
        </button>
      </nav>
    </motion.div>
  );
};
