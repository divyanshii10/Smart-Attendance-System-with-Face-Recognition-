import { useState, useEffect, useRef } from 'react';
import { Bell, User, CheckCircle, AlertTriangle, Info, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { getGreeting } from '../../utils/helpers';
import { notificationsAPI, AppNotification } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    try {
      const data = await notificationsAPI.get();
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif: AppNotification) => {
    if (!notif.is_read) {
      await notificationsAPI.markRead(notif.id);
      loadNotifications();
    }
    setShowNotifications(false);

    // Simple navigation based on keyword type
    if (notif.message.toLowerCase().includes("present")) navigate('/live-attendance');
    if (notif.message.toLowerCase().includes("report")) navigate('/reports');
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    await notificationsAPI.markAllRead();
    loadNotifications();
  };

  return (
    <header className="
  fixed top-0 left-64 right-0 h-16
  bg-[#0B1120]
  border-b border-white/[0.06]
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

        <p className="text-sm text-[#6B7280]">
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

        {/* Notification Container */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="
              relative p-2
              text-[#9CA3AF]
              hover:text-[#E5E7EB]
              bg-[#111827]
              border border-white/[0.06]
              rounded-lg
              transition
            "
          >
            <Bell className="w-5 h-5" />

            {/* Notification badge */}
            {unreadCount > 0 && (
              <span className="
                absolute -top-1 -right-1
                min-w-4 h-4 px-1
                bg-[#EF4444]
                text-white text-[10px] font-bold
                flex items-center justify-center
                rounded-full
              ">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </motion.button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="
                  absolute right-0 mt-3 w-80
                  bg-[#111827]
                  border border-white/[0.08]
                  rounded-xl shadow-2xl
                  overflow-hidden
                  z-50
                "
              >
                <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Notifications</h3>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      You have {unreadCount} unread messages
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-[#4F46E5] hover:text-[#6366F1] transition flex items-center gap-1 bg-[#4F46E5]/10 px-2 py-1 rounded-md"
                    >
                      <Check className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-[360px] overflow-y-auto no-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-[#6B7280]">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No new notifications</p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`
                            p-4 border-b border-white/[0.02] last:border-0
                            cursor-pointer transition
                            hover:bg-[#1F2937]
                            flex items-start gap-3
                            ${!notif.is_read ? 'bg-[#10B981]/[0.02]' : 'opacity-75'}
                          `}
                        >
                          <div className="mt-0.5">
                            {notif.type === 'success' && <CheckCircle className="w-5 h-5 text-[#10B981]" />}
                            {notif.type === 'warning' && <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />}
                            {notif.type === 'info' && <Info className="w-5 h-5 text-[#3B82F6]" />}
                          </div>

                          <div className="flex-1">
                            <p className={`text-sm ${!notif.is_read ? 'text-[#E5E7EB] font-medium' : 'text-[#D1D5DB]'}`}>
                              {notif.message}
                            </p>
                            <p className="text-xs text-[#6B7280] mt-1">
                              {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {!notif.is_read && (
                            <div className="w-2 h-2 bg-[#10B981] rounded-full mt-1.5" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>


        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          className="
        flex items-center space-x-3
        px-4 py-2
        bg-[#111827]
        border border-white/[0.06]
        rounded-lg
        cursor-pointer
        transition
      "
        >

          {/* Avatar */}
          <div className="
        w-8 h-8
        bg-[#4F46E5]
        rounded-full
        flex items-center justify-center
      ">
            <User className="w-4 h-4 text-white" />
          </div>

          {/* Text */}
          <div className="text-sm leading-tight">
            <p className="font-medium text-[#E5E7EB]">
              {user?.name || 'Admin'}
            </p>
            <p className="text-[#6B7280] text-xs capitalize">
              {user?.role || 'Administrator'}
            </p>
          </div>

        </motion.div>

      </div>
    </header>
  );
};
