import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

const Toast = ({ id, type, message, duration = 4000, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-500/20 border-green-500/50',
                    icon: <CheckCircle className="w-5 h-5 text-green-400" />,
                    text: 'text-green-400',
                };
            case 'error':
                return {
                    bg: 'bg-red-500/20 border-red-500/50',
                    icon: <AlertCircle className="w-5 h-5 text-red-400" />,
                    text: 'text-red-400',
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-500/20 border-yellow-500/50',
                    icon: <AlertCircle className="w-5 h-5 text-yellow-400" />,
                    text: 'text-yellow-400',
                };
            default:
                return {
                    bg: 'bg-blue-500/20 border-blue-500/50',
                    icon: <Info className="w-5 h-5 text-blue-400" />,
                    text: 'text-blue-400',
                };
        }
    };

    const styles = getToastStyles();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`
        flex items-center gap-3 px-4 py-3 rounded-lg
        border backdrop-blur-xl ${styles.bg}
        min-w-[300px] max-w-md
        shadow-lg
      `}
        >
            {styles.icon}
            <p className={`flex-1 text-sm font-medium ${styles.text}`}>{message}</p>
            <button
                onClick={() => onClose(id)}
                className="text-gray-400 hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

// Toast Container and Hook
interface ToastMessage {
    id: string;
    type: ToastType;
    message: string;
}

let toastListeners: ((toasts: ToastMessage[]) => void)[] = [];
let toastMessages: ToastMessage[] = [];

export const useToast = () => {
    const [, setUpdate] = useState({});

    useEffect(() => {
        const listener = () => setUpdate({});
        toastListeners.push(listener);
        return () => {
            toastListeners = toastListeners.filter(l => l !== listener);
        };
    }, []);

    const showToast = (type: ToastType, message: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        toastMessages = [...toastMessages, { id, type, message }];
        toastListeners.forEach(listener => listener(toastMessages));
    };

    const removeToast = (id: string) => {
        toastMessages = toastMessages.filter(t => t.id !== id);
        toastListeners.forEach(listener => listener(toastMessages));
    };

    return {
        success: (message: string) => showToast('success', message),
        error: (message: string) => showToast('error', message),
        info: (message: string) => showToast('info', message),
        warning: (message: string) => showToast('warning', message),
        toasts: toastMessages,
        removeToast,
    };
};

// Toast Container Component
export const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed top-20 right-6 z-50 flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        type={toast.type}
                        message={toast.message}
                        onClose={removeToast}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};
