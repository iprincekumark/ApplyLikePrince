import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// Toast Context
const ToastContext = createContext(null);

// Toast types configuration
const toastConfig = {
    success: {
        icon: CheckCircle,
        className: 'border-l-4 border-[var(--color-success)]',
        iconColor: 'text-[var(--color-success)]',
    },
    error: {
        icon: AlertCircle,
        className: 'border-l-4 border-[var(--color-error)]',
        iconColor: 'text-[var(--color-error)]',
    },
    warning: {
        icon: AlertTriangle,
        className: 'border-l-4 border-[var(--color-warning)]',
        iconColor: 'text-[var(--color-warning)]',
    },
    info: {
        icon: Info,
        className: 'border-l-4 border-[var(--color-info)]',
        iconColor: 'text-[var(--color-info)]',
    },
};

// Individual Toast Component
const Toast = ({ id, type = 'info', title, message, onClose, duration = 5000 }) => {
    const config = toastConfig[type];
    const Icon = config.icon;

    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => onClose(id), duration);
            return () => clearTimeout(timer);
        }
    }, [id, duration, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={clsx(
                'glass-strong rounded-[var(--radius-lg)] p-4 min-w-[320px] max-w-md',
                'flex items-start gap-3 shadow-xl',
                config.className
            )}
        >
            <Icon className={clsx('shrink-0 mt-0.5', config.iconColor)} size={20} />

            <div className="flex-1 min-w-0">
                {title && (
                    <p className="font-semibold text-[var(--color-text-primary)] mb-0.5">
                        {title}
                    </p>
                )}
                <p className="text-sm text-[var(--color-text-secondary)]">
                    {message}
                </p>
            </div>

            <button
                onClick={() => onClose(id)}
                className={clsx(
                    'shrink-0 p-1 rounded-[var(--radius-md)]',
                    'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]',
                    'hover:bg-[var(--color-glass)] transition-colors duration-200'
                )}
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
    return createPortal(
        <div className="fixed top-4 right-4 z-[var(--z-toast)] flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} onClose={removeToast} />
                ))}
            </AnimatePresence>
        </div>,
        document.body
    );
};

// Toast Provider
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, type, title, message, duration }]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const toast = {
        success: (message, title) => addToast({ type: 'success', title, message }),
        error: (message, title) => addToast({ type: 'error', title, message }),
        warning: (message, title) => addToast({ type: 'warning', title, message }),
        info: (message, title) => addToast({ type: 'info', title, message }),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

// Hook to use toast
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default Toast;
