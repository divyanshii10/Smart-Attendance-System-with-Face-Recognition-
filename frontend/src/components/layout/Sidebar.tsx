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
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Live Attendance', path: '/live-attendance', icon: Camera },
  { name: 'Students', path: '/students', icon: Users },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside
      className="
        fixed left-0 top-0 h-full w-64
        bg-[#020617]
        border-r border-white/10
        flex flex-col z-30
      "
    >

      {/* 🔹 Logo Section */}
      <div className="p-6 border-b border-white/10">
      <NavLink to="/landing">
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >

          {/* Logo Icon */}
          <div
            className="
              w-10 h-10
              bg-gradient-to-br
              from-purple-500 to-purple-700
              rounded-lg
              flex items-center justify-center
            "
          >
            <Camera className="w-6 h-6 text-white" />
          </div>

          {/* Logo Text */}
          <div>
            <h1 className="text-xl font-bold gradient-text">
              AttendEase
            </h1>
            <p className="text-xs text-gray-400">
              AI Powered System
            </p>
          </div>

        </motion.div>
        </NavLink>
      </div>


      {/* 🔹 Navigation */}
      <nav className="flex-1 p-4 space-y-2">
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
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ x: 4 }}
                  className={`
                    flex items-center space-x-3
                    px-4 py-3 rounded-lg
                    transition-all duration-300
                    relative
                    ${
                      isActive
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white border border-transparent'
                    }
                  `}
                >

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="
                        absolute left-0 top-2 bottom-2
                        w-1 rounded-full
                        bg-purple-500
                      "
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}

                  <Icon className="w-5 h-5" />
                  <span className="font-medium">
                    {item.name}
                  </span>

                </motion.div>
              )}
            </NavLink>
          );
        })}
      </nav>


      {/* 🔹 Logout */}
      <div className="p-4 border-t border-white/10">
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="
            flex items-center space-x-3
            px-4 py-3 rounded-lg
            w-full
            text-red-400
            border border-red-500/20
            hover:bg-red-500/10
            hover:text-red-300
            transition
          "
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">
            Logout
          </span>
        </motion.button>
      </div>

    </aside>
  );
};