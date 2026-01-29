import { clsx } from 'clsx';

const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    className,
    ...props
}) => {
    const variants = {
        default: 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]',
        primary: 'gradient-bg text-white',
        success: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
        warning: 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
        error: 'bg-[var(--color-error-light)] text-[var(--color-error)]',
        info: 'bg-[var(--color-info-light)] text-[var(--color-info)]',
        outline: 'bg-transparent border border-[var(--color-glass-border)] text-[var(--color-text-secondary)]',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center font-medium rounded-[var(--radius-full)]',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;
