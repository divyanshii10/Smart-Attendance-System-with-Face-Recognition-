import { Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { getGreeting } from '../../utils/helpers';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-64 right-0 h-16 glass border-b border-cyan-400/20 flex items-center px-6 z-20">

      {/* LEFT: Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold gradient-text font-tech">
          {getGreeting()}, {user?.name || 'Admin'}
        </h2>
        <p className="text-sm text-cyan-300/70">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </motion.div>

      {/* RIGHT: Actions */}
      <div className="ml-auto flex items-center space-x-4">

        {/* Notification */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-2 text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition border border-transparent hover:border-cyan-400/30"
        >
          <Bell className="w-5 h-5" />
          <motion.span
            className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </motion.button>

        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-3 px-4 py-2 glass-strong rounded-lg border border-cyan-400/20 cursor-pointer"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-glow-cyan">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-white">
              {user?.name || 'Admin'}
            </p>
            <p className="text-cyan-300/70 capitalize text-xs">
              {user?.role || 'Administrator'}
            </p>
          </div>
        </motion.div>
      </div>

    </header>
  );
};
