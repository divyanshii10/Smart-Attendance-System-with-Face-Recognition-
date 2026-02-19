import { Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { getGreeting } from '../../utils/helpers';

export const Header = () => {
  const { user } = useAuth();

  return (
   <header className="
  fixed top-0 left-64 right-0 h-16
  bg-[#020617]
  border-b border-white/10
  flex items-center px-6
  z-20
">

  {/* LEFT: Greeting */}
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-xl font-semibold text-white">
      {getGreeting()}, 
      <span className="gradient-text ml-1">
        {user?.name || 'Admin'}
      </span>
    </h2>

    <p className="text-sm text-gray-400">
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

    {/* 🔔 Notification */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="
        relative p-2
        text-gray-300
        hover:text-white
        bg-[#0B1220]
        border border-white/10
        rounded-lg
        transition
      "
    >
      <Bell className="w-5 h-5" />

      {/* Notification dot */}
      <span className="
        absolute top-1 right-1
        w-2 h-2
        bg-purple-500
        rounded-full
      " />
    </motion.button>


    {/* 👤 Profile */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      className="
        flex items-center space-x-3
        px-4 py-2
        bg-[#0B1220]
        border border-white/10
        rounded-lg
        cursor-pointer
        transition
      "
    >

      {/* Avatar */}
      <div className="
        w-8 h-8
        bg-gradient-to-br
        from-purple-500 to-purple-700
        rounded-full
        flex items-center justify-center
      ">
        <User className="w-4 h-4 text-white" />
      </div>

      {/* Text */}
      <div className="text-sm leading-tight">
        <p className="font-medium text-white">
          {user?.name || 'Admin'}
        </p>
        <p className="text-gray-400 text-xs capitalize">
          {user?.role || 'Administrator'}
        </p>
      </div>

    </motion.div>

  </div>
</header>
  );
};
