import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
    Upload,
    Zap,
    BarChart3,
    CheckCircle,
    ArrowRight,
    FileText,
    Briefcase,
    Target,
    Clock,
    Shield,
    Sparkles
} from 'lucide-react';
import { Navbar, Footer } from '@components/layout';
import { Button, Card } from '@components/ui';

const LandingPage = () => {
    const features = [
        {
            icon: Upload,
            title: 'Upload Once',
            description: 'Upload your resume in PDF or DOCX format. Our AI parses all your information automatically.',
            color: 'from-violet-500 to-purple-600',
        },
        {
            icon: Zap,
            title: 'Auto Apply',
            description: 'Apply to hundreds of jobs across multiple platforms with a single click. Save hours daily.',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: BarChart3,
            title: 'Track Progress',
            description: 'Monitor all your applications in one dashboard. Get insights on your job search performance.',
            color: 'from-emerald-500 to-teal-500',
        },
    ];

    const stats = [
        { value: '10,000+', label: 'Applications Sent' },
        { value: '500+', label: 'Happy Users' },
        { value: '95%', label: 'Time Saved' },
        { value: '50+', label: 'Platforms' },
    ];

    const steps = [
        {
            step: 1,
            title: 'Create Your Account',
            description: 'Sign up in seconds and set up your profile with your job preferences.',
            icon: FileText,
        },
        {
            step: 2,
            title: 'Upload Your Resume',
            description: 'Our AI-powered parser extracts all relevant information from your resume.',
            icon: Upload,
        },
        {
            step: 3,
            title: 'Select Platforms',
            description: 'Choose which job platforms you want to apply to - LinkedIn, Hirect, Cutshort, and more.',
            icon: Target,
        },
        {
            step: 4,
            title: 'Auto Apply & Track',
            description: 'Sit back as we submit applications for you. Track everything in real-time.',
            icon: Briefcase,
        },
    ];

    const benefits = [
        { icon: Clock, text: 'Save 10+ hours weekly on job applications' },
        { icon: Target, text: 'Apply to more jobs, increase your chances' },
        { icon: Shield, text: 'Secure and private - your data is encrypted' },
        { icon: Sparkles, text: 'AI-generated cover letters for each application' },
    ];

    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-100px' },
        transition: { duration: 0.6, ease: 'easeOut' },
    };

    const staggerContainer = {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
        transition: { staggerChildren: 0.1 },
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-[var(--color-accent-start)]/20 blur-[150px] animate-float" />
                    <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-[var(--color-accent-end)]/20 blur-[120px] animate-float" style={{ animationDelay: '-3s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--color-accent-mid)]/10 blur-[100px]" />

                    {/* Grid pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
                            backgroundSize: '60px 60px'
                        }}
                    />
                </div>

                <div className="container relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                                <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                                <span className="text-sm text-[var(--color-text-secondary)]">
                                    Now with AI-powered cover letters
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                                Apply to Jobs{' '}
                                <span className="gradient-text">Like a Pro</span>
                            </h1>

                            <p className="text-xl text-[var(--color-text-secondary)] mb-8 max-w-lg">
                                Upload your resume once, apply to hundreds of jobs automatically.
                                Let AI do the heavy lifting while you focus on landing interviews.
                            </p>

                            <div className="flex flex-wrap gap-4 mb-12">
                                <Link to="/register">
                                    <Button size="lg" icon={<ArrowRight size={20} />} iconPosition="right">
                                        Get Started Free
                                    </Button>
                                </Link>
                                <a
                                    href="#how-it-works"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                >
                                    <Button variant="secondary" size="lg">
                                        See How It Works
                                    </Button>
                                </a>
                            </div>

                            {/* Quick Benefits */}
                            <div className="flex flex-wrap gap-x-6 gap-y-3">
                                {benefits.slice(0, 2).map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                                        <CheckCircle size={16} className="text-[var(--color-success)]" />
                                        {benefit.text}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right: Floating Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative">
                                {/* Main Card */}
                                <Card className="p-8 animate-float">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-[var(--radius-xl)] gradient-bg flex items-center justify-center">
                                            <FileText className="text-white" size={28} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[var(--color-text-primary)]">Resume Uploaded</h3>
                                            <p className="text-sm text-[var(--color-text-secondary)]">AI parsing complete</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { label: 'Skills Detected', value: '12 skills' },
                                            { label: 'Experience', value: '4+ years' },
                                            { label: 'Match Score', value: '94%' },
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 rounded-[var(--radius-lg)] bg-[var(--color-bg-tertiary)]">
                                                <span className="text-sm text-[var(--color-text-secondary)]">{item.label}</span>
                                                <span className="font-semibold text-[var(--color-text-primary)]">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button fullWidth className="mt-6" icon={<Zap size={18} />}>
                                        Apply to 50 Jobs
                                    </Button>
                                </Card>

                                {/* Floating Stats */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="absolute -bottom-6 -left-6 glass p-4 rounded-[var(--radius-xl)] shadow-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[var(--color-success-light)] flex items-center justify-center">
                                            <CheckCircle size={20} className="text-[var(--color-success)]" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg text-[var(--color-text-primary)]">127</p>
                                            <p className="text-xs text-[var(--color-text-secondary)]">Applications sent today</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 border-y border-[var(--color-glass-border)]">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                {...fadeInUp}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <p className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</p>
                                <p className="text-[var(--color-text-secondary)]">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="section">
                <div className="container">
                    <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Supercharge Your <span className="gradient-text">Job Search</span>
                        </h2>
                        <p className="text-lg text-[var(--color-text-secondary)]">
                            Stop spending hours on repetitive applications. Let our AI-powered platform do the work for you.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                            >
                                <Card className="h-full text-center p-8 group">
                                    <div className={clsx(
                                        'w-16 h-16 rounded-[var(--radius-xl)] mx-auto mb-6',
                                        'flex items-center justify-center',
                                        'bg-gradient-to-br',
                                        feature.color,
                                        'group-hover:scale-110 transition-transform duration-300'
                                    )}>
                                        <feature.icon size={32} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[var(--color-text-secondary)]">
                                        {feature.description}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="section bg-gradient-to-b from-transparent via-[var(--color-accent-start)]/5 to-transparent">
                <div className="container">
                    <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            How It <span className="gradient-text">Works</span>
                        </h2>
                        <p className="text-lg text-[var(--color-text-secondary)]">
                            Get started in minutes and start applying to jobs automatically.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                                className="relative"
                            >
                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gradient-to-r from-[var(--color-accent-start)] to-[var(--color-accent-end)] opacity-30" />
                                )}

                                <div className="text-center">
                                    {/* Step Number */}
                                    <div className="relative inline-block mb-6">
                                        <div className="w-24 h-24 rounded-full glass flex items-center justify-center mx-auto">
                                            <item.icon size={36} className="text-[var(--color-accent-mid)]" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                                            {item.step}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-[var(--color-text-secondary)]">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="section">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div {...fadeInUp}>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Why Choose <span className="gradient-text">ApplyLikePrince</span>?
                            </h2>
                            <p className="text-lg text-[var(--color-text-secondary)] mb-8">
                                We've helped thousands of job seekers land their dream roles faster than ever before.
                            </p>

                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] glass"
                                    >
                                        <div className="w-10 h-10 rounded-[var(--radius-lg)] gradient-bg flex items-center justify-center shrink-0">
                                            <benefit.icon size={20} className="text-white" />
                                        </div>
                                        <p className="text-[var(--color-text-primary)] font-medium">
                                            {benefit.text}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="p-8">
                                <div className="text-center mb-6">
                                    <p className="text-6xl font-bold gradient-text mb-2">95%</p>
                                    <p className="text-[var(--color-text-secondary)]">Time saved on applications</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[var(--color-text-secondary)]">Traditional Method</span>
                                        <span className="font-semibold text-[var(--color-error)]">4+ hours/day</span>
                                    </div>
                                    <div className="h-3 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
                                        <div className="h-full w-full bg-[var(--color-error)]" />
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-[var(--color-text-secondary)]">With ApplyLikePrince</span>
                                        <span className="font-semibold text-[var(--color-success)]">15 mins/day</span>
                                    </div>
                                    <div className="h-3 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
                                        <div className="h-full w-1/12 gradient-bg" />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section">
                <div className="container">
                    <motion.div
                        {...fadeInUp}
                        className="relative overflow-hidden rounded-[var(--radius-2xl)] p-12 md:p-16 text-center gradient-animated"
                    >
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/20" />

                        <div className="relative">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Ready to Transform Your Job Search?
                            </h2>
                            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                                Join thousands of job seekers who are landing more interviews with less effort.
                            </p>
                            <Link to="/register">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    icon={<ArrowRight size={20} />}
                                    iconPosition="right"
                                    className="bg-white text-[var(--color-accent-start)] hover:bg-white/90"
                                >
                                    Get Started for Free
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
