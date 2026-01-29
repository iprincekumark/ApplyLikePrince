import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

const variants = {
    primary: 'bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 text-white hover:from-violet-600 hover:via-blue-600 hover:to-cyan-600',
    secondary: 'glass text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]',
    ghost: 'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-glass)]',
    danger: 'bg-[var(--color-error)] text-white hover:bg-[var(--color-error)]/90',
    outline: 'border border-[var(--color-glass-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-glass)] hover:border-[var(--color-accent-mid)]',
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-base gap-2',
    lg: 'px-7 py-3.5 text-lg gap-2.5',
};

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    className,
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    type = 'button',
    onClick,
    ...props
}, ref) => {
    const isDisabled = disabled || loading;

    return (
        <button
            ref={ref}
            type={type}
            disabled={isDisabled}
            onClick={onClick}
            className={clsx(
                // Base styles
                'relative inline-flex items-center justify-center font-semibold',
                'rounded-[var(--radius-lg)] transition-all duration-300',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-mid)] focus-visible:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
                // Shimmer effect for primary
                variant === 'primary' && 'btn-shimmer',
                // Hover effects
                !isDisabled && 'hover:scale-[1.02] active:scale-[0.98]',
                // Shadow for primary
                variant === 'primary' && 'shadow-lg hover:shadow-xl',
                // Width
                fullWidth && 'w-full',
                // Variant & Size
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
                    {children}
                    {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
                </>
            )}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
