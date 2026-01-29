import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Gradient orbs */}
                <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-[var(--color-accent-start)]/20 blur-[120px] animate-float" />
                <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-[var(--color-accent-end)]/20 blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[var(--color-accent-mid)]/10 blur-[80px]" />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            <Navbar />

            <main className="flex-1 flex items-center justify-center pt-20 pb-12 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <Outlet />
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default AuthLayout;
