import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    LogOut,
    User,
    Settings,
    ChevronDown,
    FileText,
    Briefcase,
    LayoutDashboard,
    Folders
} from 'lucide-react';
import useAuthStore from '@store/authStore';
import Button from '@components/ui/Button';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
    }, [location.pathname]);

    // Smooth scroll to section handler
    const scrollToSection = useCallback((e, sectionId) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);

        // If we're not on home page, navigate home first then scroll
        if (location.pathname !== '/') {
            navigate('/');
            // Wait for navigation then scroll
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [location.pathname, navigate]);

    // Scroll to top handler
    const scrollToTop = useCallback((e) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);

        if (location.pathname !== '/') {
            navigate('/');
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location.pathname, navigate]);

    const publicLinks = [
        { id: 'home', label: 'Home', isHome: true },
        { id: 'features', label: 'Features' },
        { id: 'how-it-works', label: 'How It Works' },
    ];

    const dashboardLinks = [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/resumes', label: 'Resumes', icon: FileText },
        { to: '/applications', label: 'Applications', icon: Briefcase },
        { to: '/platforms', label: 'Platforms', icon: Folders },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className={clsx(
                'fixed top-0 left-0 right-0 z-[var(--z-sticky)]',
                'transition-all duration-300',
                scrolled
                    ? 'glass-sm py-3 shadow-lg'
                    : 'bg-transparent py-5'
            )}
        >
            <div className="container flex items-center justify-between">
                {/* Logo */}
                <Link
                    to={isAuthenticated ? '/dashboard' : '/'}
                    className="flex items-center gap-2 group"
                >
                    <div className="w-10 h-10 rounded-[var(--radius-lg)] gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-xl">A</span>
                    </div>
                    <span className="text-xl font-bold gradient-text hidden sm:block">
                        ApplyLikePrince
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {isAuthenticated ? (
                        // Dashboard navigation
                        dashboardLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={clsx(
                                    'flex items-center gap-2 text-sm font-medium transition-colors duration-200',
                                    isActive(link.to)
                                        ? 'text-[var(--color-accent-mid)]'
                                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                )}
                            >
                                <link.icon size={18} />
                                {link.label}
                            </Link>
                        ))
                    ) : (
                        // Public navigation with smooth scroll
                        publicLinks.map((link) => (
                            <a
                                key={link.id}
                                href={link.isHome ? '/' : `#${link.id}`}
                                onClick={(e) => link.isHome ? scrollToTop(e) : scrollToSection(e, link.id)}
                                className={clsx(
                                    'text-sm font-medium transition-colors duration-200 cursor-pointer',
                                    'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                )}
                            >
                                {link.label}
                            </a>
                        ))
                    )}
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-4">
                    {isAuthenticated ? (
                        // User Profile Dropdown
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className={clsx(
                                    'flex items-center gap-3 px-3 py-2 rounded-[var(--radius-lg)]',
                                    'hover:bg-[var(--color-glass)] transition-colors duration-200'
                                )}
                            >
                                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                        {user?.fullName?.[0] || 'U'}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                                    {user?.fullName || 'User'}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={clsx(
                                        'text-[var(--color-text-tertiary)] transition-transform duration-200',
                                        isProfileOpen && 'rotate-180'
                                    )}
                                />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className={clsx(
                                            'absolute right-0 top-full mt-2 w-56',
                                            'glass-strong rounded-[var(--radius-lg)] p-2 shadow-xl'
                                        )}
                                    >
                                        <Link
                                            to="/profile"
                                            className={clsx(
                                                'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)]',
                                                'text-sm text-[var(--color-text-secondary)]',
                                                'hover:bg-[var(--color-glass)] hover:text-[var(--color-text-primary)]',
                                                'transition-colors duration-200'
                                            )}
                                        >
                                            <User size={18} />
                                            Profile
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className={clsx(
                                                'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)]',
                                                'text-sm text-[var(--color-text-secondary)]',
                                                'hover:bg-[var(--color-glass)] hover:text-[var(--color-text-primary)]',
                                                'transition-colors duration-200'
                                            )}
                                        >
                                            <Settings size={18} />
                                            Settings
                                        </Link>
                                        <div className="my-2 border-t border-[var(--color-glass-border)]" />
                                        <button
                                            onClick={handleLogout}
                                            className={clsx(
                                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)]',
                                                'text-sm text-[var(--color-error)]',
                                                'hover:bg-[var(--color-error-light)]',
                                                'transition-colors duration-200'
                                            )}
                                        >
                                            <LogOut size={18} />
                                            Log Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost">Log In</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 text-[var(--color-text-primary)]"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 top-[60px] bg-black/50 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className={clsx(
                                'fixed right-0 top-[60px] bottom-0 w-80 max-w-[80vw]',
                                'glass-strong p-6 lg:hidden',
                                'flex flex-col'
                            )}
                        >
                            <div className="flex flex-col gap-2 flex-1">
                                {isAuthenticated ? (
                                    // Dashboard links use React Router Link
                                    dashboardLinks.map((link) => (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            className={clsx(
                                                'flex items-center gap-3 px-4 py-3 rounded-[var(--radius-lg)]',
                                                'text-base font-medium transition-colors duration-200',
                                                isActive(link.to)
                                                    ? 'bg-[var(--color-glass)] text-[var(--color-accent-mid)]'
                                                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-glass)] hover:text-[var(--color-text-primary)]'
                                            )}
                                        >
                                            {link.icon && <link.icon size={20} />}
                                            {link.label}
                                        </Link>
                                    ))
                                ) : (
                                    // Public links use scroll handlers
                                    publicLinks.map((link) => (
                                        <a
                                            key={link.id}
                                            href={link.isHome ? '/' : `#${link.id}`}
                                            onClick={(e) => link.isHome ? scrollToTop(e) : scrollToSection(e, link.id)}
                                            className={clsx(
                                                'flex items-center gap-3 px-4 py-3 rounded-[var(--radius-lg)]',
                                                'text-base font-medium transition-colors duration-200 cursor-pointer',
                                                'text-[var(--color-text-secondary)] hover:bg-[var(--color-glass)] hover:text-[var(--color-text-primary)]'
                                            )}
                                        >
                                            {link.label}
                                        </a>
                                    ))
                                )}
                            </div>

                            <div className="pt-6 border-t border-[var(--color-glass-border)]">
                                {isAuthenticated ? (
                                    <>
                                        <div className="flex items-center gap-3 mb-4 px-4">
                                            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                                                <span className="text-white font-medium">
                                                    {user?.fullName?.[0] || 'U'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--color-text-primary)]">
                                                    {user?.fullName || 'User'}
                                                </p>
                                                <p className="text-sm text-[var(--color-text-secondary)]">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="danger"
                                            fullWidth
                                            onClick={handleLogout}
                                            icon={<LogOut size={18} />}
                                        >
                                            Log Out
                                        </Button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Link to="/login">
                                            <Button variant="secondary" fullWidth>
                                                Log In
                                            </Button>
                                        </Link>
                                        <Link to="/register">
                                            <Button fullWidth>Get Started</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
