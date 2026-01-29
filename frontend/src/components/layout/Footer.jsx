import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import {
    Github,
    Linkedin,
    Twitter,
    Mail,
    Heart,
    ExternalLink
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { label: 'Features', to: '/#features' },
            { label: 'How It Works', to: '/#how-it-works' },
            { label: 'Pricing', to: '/#pricing' },
        ],
        resources: [
            { label: 'Documentation', to: '/docs' },
            { label: 'API Reference', to: '/api' },
            { label: 'Blog', to: '/blog' },
        ],
        company: [
            { label: 'About', to: '/about' },
            { label: 'Privacy Policy', to: '/privacy' },
            { label: 'Terms of Service', to: '/terms' },
        ],
    };

    const socialLinks = [
        { icon: Github, href: 'https://github.com/iprincekumark', label: 'GitHub' },
        { icon: Linkedin, href: 'https://linkedin.com/in/iprincekumark', label: 'LinkedIn' },
        { icon: Twitter, href: 'https://twitter.com/iprincekumark', label: 'Twitter' },
        { icon: Mail, href: 'mailto:prince@applylikeprince.com', label: 'Email' },
    ];

    return (
        <footer className="relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent-start)]/5 to-transparent pointer-events-none" />

            <div className="container relative">
                {/* Main Footer Content */}
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-[var(--radius-xl)] gradient-bg flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">A</span>
                            </div>
                            <span className="text-2xl font-bold gradient-text">
                                ApplyLikePrince
                            </span>
                        </Link>
                        <p className="text-[var(--color-text-secondary)] mb-6 max-w-sm">
                            Automate your job applications with AI-powered resume parsing and multi-platform submission. Land more interviews, faster.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={clsx(
                                        'w-10 h-10 rounded-[var(--radius-lg)] glass',
                                        'flex items-center justify-center',
                                        'text-[var(--color-text-tertiary)] hover:text-[var(--color-accent-mid)]',
                                        'hover:scale-110 transition-all duration-300'
                                    )}
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider mb-4">
                                {title}
                            </h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.to}
                                            className={clsx(
                                                'text-[var(--color-text-secondary)]',
                                                'hover:text-[var(--color-text-primary)]',
                                                'transition-colors duration-200',
                                                'inline-flex items-center gap-1'
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-[var(--color-glass-border)]">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-[var(--color-text-tertiary)] text-center md:text-left">
                            © {currentYear} ApplyLikePrince. All rights reserved.
                        </p>
                        <p className="text-sm text-[var(--color-text-tertiary)] flex items-center gap-1">
                            Built with <Heart size={14} className="text-[var(--color-error)] fill-current" /> by{' '}
                            <a
                                href="https://linkedin.com/in/iprincekumark"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--color-accent-mid)] hover:underline inline-flex items-center gap-1"
                            >
                                Prince <ExternalLink size={12} />
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
