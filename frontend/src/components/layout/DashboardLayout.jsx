import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Menu } from 'lucide-react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <Navbar />

            {/* Mobile sidebar toggle */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={clsx(
                    'fixed bottom-6 left-6 z-[var(--z-sticky)]',
                    'lg:hidden glass p-4 rounded-full',
                    'text-[var(--color-text-primary)]',
                    'shadow-lg hover:shadow-xl transition-shadow duration-300'
                )}
                aria-label="Toggle sidebar"
            >
                <Menu size={24} />
            </button>

            {/* Mobile sidebar backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[calc(var(--z-sticky)-1)] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content */}
            <main
                className={clsx(
                    'min-h-screen pt-[72px]',
                    'lg:pl-64',
                    'transition-all duration-300'
                )}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="container py-8"
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
};

export default DashboardLayout;
