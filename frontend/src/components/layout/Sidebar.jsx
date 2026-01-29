import { NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    Folders,
    User,
    Settings,
    HelpCircle,
    LogOut
} from 'lucide-react';
import useAuthStore from '@store/authStore';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { logout } = useAuthStore();

    const mainLinks = [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/resumes', label: 'Resumes', icon: FileText },
        { to: '/applications', label: 'Applications', icon: Briefcase },
        { to: '/platforms', label: 'Platforms', icon: Folders },
    ];

    const bottomLinks = [
        { to: '/profile', label: 'Profile', icon: User },
        { to: '/settings', label: 'Settings', icon: Settings },
        { to: '/help', label: 'Help & Support', icon: HelpCircle },
    ];

    const NavItem = ({ to, label, icon: Icon }) => {
        const isActive = location.pathname === to;

        return (
            <NavLink
                to={to}
                onClick={onClose}
                className={clsx(
                    'relative flex items-center gap-3 px-4 py-3 rounded-[var(--radius-lg)]',
                    'text-sm font-medium transition-all duration-200',
                    'group',
                    isActive
                        ? 'text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                )}
            >
                {/* Active background */}
                {isActive && (
                    <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 glass rounded-[var(--radius-lg)]"
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    />
                )}

                {/* Active gradient bar */}
                {isActive && (
                    <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full gradient-bg"
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    />
                )}

                <Icon
                    size={20}
                    className={clsx(
                        'relative z-10 transition-colors duration-200',
                        isActive && 'text-[var(--color-accent-mid)]'
                    )}
                />
                <span className="relative z-10">{label}</span>

                {/* Hover glow */}
                <div
                    className={clsx(
                        'absolute inset-0 rounded-[var(--radius-lg)] opacity-0',
                        'bg-gradient-to-r from-[var(--color-accent-start)]/10 to-transparent',
                        'group-hover:opacity-100 transition-opacity duration-200',
                        isActive && 'hidden'
                    )}
                />
            </NavLink>
        );
    };

    return (
        <aside
            className={clsx(
                'fixed left-0 top-[72px] bottom-0 w-64',
                'glass-sm border-r border-[var(--color-glass-border)]',
                'flex flex-col',
                'transition-transform duration-300 lg:translate-x-0',
                'z-[var(--z-sticky)]',
                isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}
        >
            {/* Main Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <p className="px-4 py-2 text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                    Main Menu
                </p>
                {mainLinks.map((link) => (
                    <NavItem key={link.to} {...link} />
                ))}
            </nav>

            {/* Bottom Navigation */}
            <div className="p-4 border-t border-[var(--color-glass-border)]">
                <p className="px-4 py-2 text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                    Settings
                </p>
                <div className="space-y-1">
                    {bottomLinks.map((link) => (
                        <NavItem key={link.to} {...link} />
                    ))}
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    className={clsx(
                        'w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-[var(--radius-lg)]',
                        'text-sm font-medium text-[var(--color-error)]',
                        'hover:bg-[var(--color-error-light)] transition-colors duration-200'
                    )}
                >
                    <LogOut size={20} />
                    Log Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
