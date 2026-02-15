import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Camera,
  FileText,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Live Attendance', path: '/live-attendance', icon: Camera },
  { name: 'Students', path: '/students', icon: Users },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass-strong border-r border-cyan-400/20 flex flex-col z-30">

      {/* Logo Section */}
      <div className="p-6 border-b border-cyan-400/20">
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-glow-cyan"
            animate={{
              boxShadow: [
                '0 0 20px rgba(0,255,255,0.5)',
                '0 0 30px rgba(0,255,255,0.7)',
                '0 0 20px rgba(0,255,255,0.5)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Camera className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold gradient-text font-tech">AttendEase</h1>
            <p className="text-xs text-cyan-300/70">AI Powered System</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
            >
              {({ isActive }) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-all duration-300 relative overflow-hidden
                    ${isActive
                      ? 'bg-cyan-500/20 text-cyan-300 shadow-glow-cyan'
                      : 'text-gray-300 hover:bg-white/5 hover:text-cyan-300'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 shadow-glow-cyan"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}

                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="font-medium relative z-10">{item.name}</span>

                  {/* Hover glow */}
                  {!isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-cyan-400/20">
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full transition-all border border-red-500/20 hover:border-red-500/40"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </aside>
  );
};
